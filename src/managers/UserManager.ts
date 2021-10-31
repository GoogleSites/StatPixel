import fs from 'fs/promises';
import path from 'path';

import type { Guild, Player } from 'hypixel-api-v2';
import { ObjectId } from 'mongodb';
import cron from 'node-cron';
import { createModel } from 'polynomial-regression';

import type Main from '../classes/Main';
import { StatPixelAPI } from '../classes/Main';
import type { Session, User, UserHistory } from '../typings';
import { loadImage } from 'canvas';
import type { Image } from 'canvas';

export default class UserManager {
  private client: Main;
  private history: StatPixelAPI;

  public images: { [key: string]: Image };

  constructor(client: Main) {
    this.client = client;
    this.images = {};
    this.history = new StatPixelAPI(
      this.client.config.history_keys,
      this.client
    );
  }

  public async init() {
    this.images = (await Promise.all(
      (await fs.readdir(path.join(__dirname, '..', 'images')))
        .map(async f => ({
          data: await loadImage(path.join(__dirname, '..', 'images', f)),
          file: f
        })))
      ).reduce((a: { [key: string]: Image }, b) => {
        a[b.file] = b.data;

        return a;
      }, {});

    if (!this.client.shard!.ids.includes(0))
      return;

    cron.schedule('0 * * * *', () => {
      this.addHistoryData(1);
    });

    cron.schedule('0 */3 * * *', () => {
      this.addHistoryData(3);
    });

    cron.schedule('0 */12 * * *', () => {
      this.addHistoryData(12);
    });

    cron.schedule('0 0 * * *', async () => {
      const date = new Date();
      const dayOfMonth = date.getDate();
      const dayOfWeek = date.getDay();

      const users: {
        _id: string;
        documents: ObjectId[];
        daily: ObjectId;
        weekly: ObjectId;
        monthly: ObjectId;
      }[] = await this.client.database.users
        .aggregate([
          {
            $match: {
              daily: { $exists: true }
            }
          },
          {
            $group: {
              _id: '$uuid',
              documents: {
                $push: '$_id'
              },
              daily: {
                $first: '$daily.id'
              },
              weekly: {
                $first: '$weekly.id'
              },
              monthly: {
                $first: '$monthly.id'
              }
            }
          }
        ])
        .toArray();

      if (users.length === 0)
        return;

      const operation = this.client.database.users.initializeUnorderedBulkOp();
      const after: Promise<any>[] = [];

      for (const { _id: uuid, documents, ...periodic } of users) {
        const now = Date.now();
        const player = await this.client.hypixel.player(uuid);
        const daily = new ObjectId();

        const promises: Promise<any>[] = [this.createSession(player, daily)];

        const update: any = {
          daily: {
            id: daily,
            time: now
          }
        };

        if (dayOfWeek === 0 || dayOfMonth === 1) {
          if (dayOfWeek === 0) {
            update.weekly = {
              id: daily,
              time: now
            };

            if (!periodic.weekly.equals(periodic.monthly) || dayOfMonth === 1) {
              after.push(this.deleteSession(periodic.weekly));
            }
          }

          if (dayOfMonth === 1) {
            update.monthly = {
              id: daily,
              time: now
            };

            if (!periodic.monthly.equals(periodic.weekly) || dayOfWeek === 0) {
              after.push(this.deleteSession(periodic.monthly));
            }
          }
        } else {
          after.push(this.deleteSession(periodic.daily));
        }

        await Promise.allSettled(promises);

        operation
          .find({
            _id: { $in: documents }
          })
          .update({
            $set: update
          });
      }

      await operation.execute();
      await Promise.allSettled(after);
    });
  }

  public async deleteSession(id: ObjectId) {
    await fs
      .unlink(path.join(__dirname, '..', 'sessions', id.toHexString()))
      .catch(() => {});
  }

  public async createSession(player: Player, id: ObjectId): Promise<Session> {
    await fs.writeFile(
      path.join(__dirname, '..', 'sessions', id.toHexString()),
      JSON.stringify(player)
    );

    return {
      id,
      created_at: Date.now()
    };
  }

  public async findOldestSession(uuid: string): Promise<Session | null> {
    return (
      (
        await this.client.database.users
          .find({ uuid })
          .sort({ 'sessions.0.created_at': 1 })
          .limit(1)
          .toArray()
      )[0]?.sessions?.[0] ?? null
    );
  }

  public async loadSession(id: ObjectId): Promise<Player> {
    return JSON.parse(
      await fs.readFile(
        path.join(__dirname, '..', 'sessions', id.toHexString()),
        'utf8'
      )
    );
  }

  public async findSessionOfType(
    type: 'daily' | 'weekly' | 'monthly' = 'daily',
    player: Player
  ): Promise<Session> {
    const document: User | null = await this.client.database.users.findOne({
      uuid: player.uuid,
      [type]: { $exists: true }
    });

    if (document) {
      const session = document[type]!;

      return {
        id: session.id,
        created_at: session.time
      };
    }

    const now = Date.now();
    const id = new ObjectId();
    const insert = {
      id,
      created_at: Date.now()
    };

    await this.createSession(player, id);
    await this.client.database.users.insertOne({
      _id: id,
      uuid: player.uuid,
      daily: {
        id,
        time: now
      },
      weekly: {
        id,
        time: now
      },
      monthly: {
        id,
        time: now
      },
      sessions: [insert]
    });

    return insert;
  }

  public async findSession(
    player: Player,
    discord_id?: string
  ): Promise<Session> {
    const user: User | null = await this.client.database.users.findOne({
      uuid: player.uuid,
      discord_id
    });

    const session: Session | null =
      user !== null
        ? user.sessions[user.active_session]
        : await this.findOldestSession(player.uuid);

    if (session) return session;

    const id = new ObjectId();
    const insert = {
      id,
      created_at: Date.now()
    };

    await this.createSession(player, id);
    await this.client.database.users.insertOne({
      _id: id,
      uuid: player.uuid,
      sessions: [insert]
    });

    return insert;
  }

  private descendObject(object: any, key: string) {
    return key.split(',').reduce((a, b) => a?.[b], object);
  }

  public projectDataAt(
    history: UserHistory,
    timestamp: number,
    keys: string[],
    degree = 2
  ) {
    const projected = (keys ?? Object.keys(history.data)).reduce(
      (a: { [key: string]: number }, b) => {
        a[b] = this.project(history.data[b], degree).estimate(
          degree,
          timestamp
        );

        return a;
      },
      {}
    );

    return projected;
  }

  public project(
    data: [number, number][],
    degree = 2
  ): {
    estimate: (degree: number, x: number) => number;
    estimateX: (degree: number, y: number) => number | null;
    expressions: () => { [key: number]: string };
  } {
    const model = createModel();

    model.fit(data, [degree]);

    return model;
  }

  public async addHistoryData(period = 1) {
    const data: UserHistory[] = await this.client.database.history
      .find({
        period
      })
      .toArray();

    const operation = this.client.database.history.initializeUnorderedBulkOp();

    for (const entry of data) {
      const player = await this.history.player(entry.uuid, false);
      const time = Math.floor(Date.now() / 1000);

      let changed = false;

      const push = Object.keys(entry.data).reduce(
        (a: {
          [key: string]: {
            $each: [ [ number, number ] ],
            $slice: number
          }
        }, b) => {
          const data = this.descendObject(player, b);
          const entries = entry.data[b];

          if (
            typeof data === 'number' &&
            (entries.length === 0 || entries[entries.length - 1][1] !== data) &&
            (changed = true)
          ) {
            a[`data.${b}`] = {
              $each: [[time, data]],
              $slice: -this.client.config.history_snapshot_window
            };
          }

          return a;
        },
        {}
      );

      if (changed)
        operation.find({ uuid: entry.uuid }).updateOne({ $push: push });
    }
  }

  public async createHistory(player: Player, period = 1): Promise<UserHistory> {
    const { value }: { value?: UserHistory } =
      await this.client.database.history.findOneAndUpdate(
        {
          uuid: player.uuid
        },
        {
          $setOnInsert: {
            data: this.client.config.default_history_keys
          },
          $min: {
            period
          }
        },
        { upsert: true, returnDocument: 'after' }
      );

    return (
      value ??
      (await this.client.database.history.findOne({
        uuid: player.uuid
      }))
    );
  }

  public async addHistoryEntry(player: Player) {
    const history = await this.createHistory(player, 3);
    const time = Math.floor(Date.now() / 1000);

    let changed = false;

    const push = Object.keys(history.data).reduce(
      (a: {
        [key: string]: {
          $each: [ [ number, number ] ],
          $slice: number
        }
      }, b) => {
        const data = this.descendObject(player, b);
        const entries = history.data[b];

        if (
          typeof data === 'number' &&
          (entries.length === 0 || entries[entries.length - 1][1] !== data) &&
          (changed = true)
        ) {
          a[`data.${b}`] = {
            $each: [[time, data]],
            $slice: -this.client.config.history_snapshot_window
          };
        }

        return a;
      },
      {}
    );

    if (changed) {
      await this.client.database.history.updateOne(
        {
          _id: history._id
        },
        {
          $push: push
        }
      );
    }
  }

  public async addHistory(player: Player, key: string, period = 3) {
    const value = this.descendObject(player, key);
    const time = Math.floor(Date.now() / 1000);

    if (typeof value !== 'number')
      return { success: false, type: typeof value };

    await this.client.database.history.updateOne(
      {
        uuid: player.uuid,
        [`data.${key}`]: { $exists: false }
      },
      {
        $min: {
          period
        },
        $set: {
          [`data.${key}`]: [time, value]
        }
      },
      { upsert: true }
    );

    return { success: true };
  }

  public async addPlayer(player: Player) {
    const stats = player.stats?.Bedwars;

    if (stats === undefined || player.achievements === undefined) return;

    await this.client.database.hypixel_players.updateOne(
      {
        uuid: player.uuid
      },
      {
        $set: {
          checked_at: Date.now(),
          bedwars: {
            level: player.achievements.bedwars_level ?? 0,
            experience: stats.experience ?? 0,
            beds_broken: stats.beds_broken_bedwars ?? 0,
            beds_lost: stats.beds_lost_bedwars ?? 0,
            wins: stats.wins_bedwars ?? 0,
            losses: stats.losses_bedwars ?? 0,
            kills: stats.kills_bedwars ?? 0,
            deaths: stats.deaths_bedwars ?? 0,
            final_kills: stats.final_kills_bedwars ?? 0,
            final_deaths: stats.final_deaths_bedwars ?? 0
          }
        }
      },
      { upsert: true }
    );
  }

  public async addGuild(guild: Guild) {
    await this.client.database.hypixel_guilds.updateOne(
      {
        id: guild._id
      },
      {
        $set: {
          checked_at: Date.now(),
          name: guild.name,
          name_lower: guild.name_lower,
          total_coins: guild.coinsEver,
          experience: guild.exp,
          game_experience: guild.guildExpByGameType,
          members: guild.members.map(m => ({
            uuid: m.uuid,
            quests: m.questParticipation,
            joined_at: m.joined
          }))
        }
      },
      { upsert: true }
    );
  }
}
