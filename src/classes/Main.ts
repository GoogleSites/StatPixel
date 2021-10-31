import { promises as fs } from 'fs';
import path from 'path';

import { Client, Collection, Guild } from 'discord.js-light';
import type { ClientOptions, Message } from 'discord.js-light';
import { HypixelAPI } from 'hypixel-api-v2';
import type { ObjectId } from 'mongodb';
import Cache from 'node-cache';

import config from '../config';
import DatabaseManager from '../managers/DatabaseManager';
import UserManager from '../managers/UserManager';
import ServerManager from '../managers/ServerManager';
import type { Settings } from '../typings';
import Find from '../utils/Find';
import HypixelUtil from '../utils/HypixelUtil';
import Util from '../utils/Util';
import type BaseCommand from './BaseCommand';
import UsageCommand from './UsageCommand';

const UUID_REGEX = /^[a-f0-9]{32}$/;
const USERNAME_REGEX = /^\w{1,16}$/;

export class StatPixelAPI extends HypixelAPI {
  private client: Main;
  private outage: {
    time: number;
    delay: number;
    active: boolean;
  };

  constructor(keys: string[], client: Main) {
    super(keys);

    this.client = client;
    this.outage = {
      time: 0,
      delay: 0,
      active: false
    };
  }

  public async guild(query: string, type: 'name' | 'player' | 'id') {
    const guild = await super.guild(query, type);

    if (guild) await this.client.profile.addGuild(guild);

    return guild;
  }

  public async player(query: string, vanilla = true) {
    const start = vanilla && Date.now();
    const player = await super.player(query);

    if (vanilla) {
      const now = Date.now();
      const delay = now - (start as number);

      if (delay < 5000 && this.outage.active) {
        this.client.user!.setPresence({
          status: 'online'
        });
      } else if (delay >= 5000 && now - this.outage.time >= 300000) {
        this.outage = {
          time: now,
          delay,
          active: true
        };

        this.client.user!.setPresence({
          status: 'idle',
          activities: [
            {
              type: 'WATCHING',
              name: `${this.client.util.formatNumber(delay)}ms`
            }
          ]
        });
      }

      if (player) {
        this.client.profile.addHistoryEntry(player);
        this.client.profile.addPlayer(player);
      }
    }

    return player;
  }

  public async getUUID(username: string): Promise<string> {
    if (UUID_REGEX.test(username)) return username;

    const { data } = await this.manager.axios.get(
      `https://api.minetools.eu/uuid/${username}`,
      {
        baseURL: undefined
      }
    );

    if (data.status === 'OK') return data.id;

    return await super.getUUID(username);
  }

  public async getUsername(uuid: string): Promise<string> {
    if (UUID_REGEX.test(uuid) === false) throw 'Invalid UUID provided.';

    const { data } = await this.manager.axios.get(
      `https://api.minetools.eu/uuid/${uuid}`,
      {
        baseURL: undefined
      }
    );

    if (data.status === 'OK') return data.name;

    return await super.getUsername(uuid);
  }

  public async getUsernameAndUUID(
    username: string
  ): Promise<{ username: string; uuid: string }> {
    if (
      UUID_REGEX.test(username) === false &&
      USERNAME_REGEX.test(username) === false
    )
      throw 'Invalid username or UUID provided.';

    const { data } = await this.manager.axios.get(
      `https://api.minetools.eu/uuid/${username}`,
      {
        baseURL: undefined
      }
    );

    if (data.status === 'OK')
      return {
        uuid: data.id,
        username: data.name
      };

    return await super.getUsernameAndUUID(username);
  }
}

export default class Main extends Client {
  public database: DatabaseManager;
  public commands: Collection<string, BaseCommand>;
  public events: Collection<string, Function[]>;
  public config: typeof config;
  public util: Util;
  public get: Find;
  public hypixel: StatPixelAPI;
  public cache: Cache;
  public hutil: HypixelUtil;
  public guild?: Guild;
  public profile: UserManager;
  public server: ServerManager;

  // @ts-ignore
  private _readied: Function;
  private nextLoopAt: number;
  public readied: Promise<unknown>;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection();
    this.events = new Collection();
    this.config = config;
    this.util = new Util(this);
    this.hutil = new HypixelUtil(this);
    this.get = new Find(this);
    this.hypixel = new StatPixelAPI(this.config.keys, this);
    this.cache = new Cache({
      stdTTL: 1800,
      checkperiod: 600,
      useClones: true
    });

    this.server = new ServerManager(this, 8000);
    this.profile = new UserManager(this);
    this.database = new DatabaseManager(
      this.config.database.uri,
      this.config.database.name
    );

    this.readied = new Promise(r => (this._readied = r));
    this.nextLoopAt = 0;
  }

  public login() {
    return super.login(this.config.token);
  }

  private async loadCommand(
    directory: string,
    name: string
  ): Promise<BaseCommand> {
    const command = new (await import(`${directory}/${name}.js`)).default(
      name,
      this
    );
    command.init();

    return command;
  }

  private getProperties(command: BaseCommand): string[] {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(command)).slice(1);
  }

  private addEvents(command: any, stop: string = 'run') {
    const raw = this.getProperties(command);
    const events = raw.slice(raw.indexOf(stop) + 1);

    for (const event of events) {
      const collection =
        this.events.get(event) || this.events.set(event, []).get(event)!;
      collection.push(command[event].bind(command));
    }
  }

  private async loadCommands(
    directory: string,
    parent: BaseCommand | null = null
  ) {
    const [files, folders]: [string[], string[]] = (
      await Promise.all(
        (
          await fs.readdir(directory)
        ).map(async f => ({
          isFile: (await fs.lstat(path.join(directory, f))).isFile(),
          name: f
        }))
      )
    ).reduce(
      (a: [string[], string[]], b) => {
        if (b.isFile) a[0].push(b.name);
        else a[1].push(b.name);

        return a;
      },
      [[], []]
    );

    let total = files.length;

    await Promise.all(
      folders.map(async folder => {
        let parentCommand: any;

        try {
          parentCommand = await this.loadCommand(directory, folder);
        } catch {
          parentCommand = new UsageCommand(folder, this);
        }

        this.addEvents(parentCommand);

        if (parent === null) this.commands.set(folder, parentCommand);
        else parent.addChild(parentCommand);

        total += await this.loadCommands(
          path.join(directory, folder),
          parentCommand
        );
      })
    );

    await Promise.all(
      files
        .filter(f => !folders.includes(f.slice(0, -3)))
        .map(async file => {
          const name = file.slice(0, -3);
          const command = await this.loadCommand(directory, name);

          this.addEvents(command);

          if (parent) parent.addChild(command);
          else this.commands.set(command.id, command);
        })
    );

    return total;
  }

  public async addCommandFolder(folder: string): Promise<number> {
    return await this.loadCommands(folder);
  }

  public async addHandlerFolder(folder: string): Promise<number> {
    const handlers = await fs.readdir(folder);

    await Promise.all(
      handlers.map(async f => {
        const handler = new (await import(path.join(folder, f))).default(this);
        this.addEvents(handler, 'init');

        return handler.init();
      })
    );

    return handlers.length;
  }

  public registerListeners() {
    for (const [event, functions] of this.events) {
      this.on(event, (...a) => functions.forEach(f => f(...a)));
    }
  }

  public find(
    args: string[],
    allowDisabledCommands = false
  ): [string[], BaseCommand] | [string[]] {
    const name = args.shift()?.toLowerCase();
    const command = this.commands.find(c => c.aliases.includes(name ?? ''));

    if (!command || (!allowDisabledCommands && !command.enabled)) return [args];

    if (command.children.size > 0) {
      const result = command.find(args);

      return [result[0], result[1]];
    }

    return [args, command];
  }

  private handleExpiry(id: ObjectId, expiresAt: number): NodeJS.Timeout {
    return setTimeout(async () => {
      const { value: document } =
        await this.database.reactions.findOneAndDelete({ _id: id });
      if (!document) return;

      this.emit(`${document.event}End`, document.data);
    }, expiresAt - Date.now());
  }

  private async initializeLoop() {
    while (true) {
      this.nextLoopAt = Date.now() + 60000;

      const expiredReactions = await this.database.reactions
        .find({
          expiry: { $lt: this.nextLoopAt }
        })
        .toArray();

      for (const document of expiredReactions) {
        this.handleExpiry(document._id, document.expiry);
      }

      await this.util.sleep(this.nextLoopAt - Date.now());
    }
  }

  public async addReactionHandler(
    message: Message,
    event: string,
    {
      users = [],
      emojis = [],
      expiry = null,
      data = null,
      removeEvent = null,
      remove = true
    }: {
      users?: string[];
      emojis: string[];
      expiry?: number | null;
      removeEvent?: string | null;
      remove?: boolean;
      data: any;
    }
  ): Promise<NodeJS.Timer | null> {
    const { insertedId } = await this.database.reactions.insertOne({
      message_id: message.id,
      channel_id: message.channel.id,
      event,
      users,
      filter: emojis,
      expiry,
      data,
      removeEvent,
      remove
    });

    return expiry !== null && expiry < this.nextLoopAt
      ? this.handleExpiry(insertedId, expiry)
      : null;
  }

  public async setSetting(
    guild_id: string,
    key: keyof Settings,
    value: string | boolean | number
  ) {
    const { value: data }: { value?: Settings } =
      await this.database.guilds.findOneAndUpdate(
        {
          guild_id
        },
        {
          $set: {
            [key]: value
          }
        },
        { upsert: true }
      );

    const settings: Settings = {
      ...this.config.defaultConfiguration,
      ...data,
      [key]: value
    };

    this.cache.set(guild_id, settings);

    return settings;
  }

  public async fetchSettings(guild_id: string) {
    const cached: Settings | undefined = this.cache.get(guild_id);

    if (cached) return cached;

    const data = await this.database.guilds.findOne({
      guild_id
    });

    if (data) {
      const config: Settings = {
        ...this.config.defaultConfiguration,
        ...data
      };

      this.cache.set(guild_id, config);

      return config;
    }

    return this.config.defaultConfiguration;
  }

  public async registerSlashCommands() {
    this.config.imageGamemodes = new Set(
      this.commands
        .get('image')!
        .children.map(c => c.aliases)
        .flat()
    );

    this.config.textGamemodes = new Set(
      this.commands
        .get('text')!
        .children.map(c => c.aliases)
        .flat()
    );

    const payload = [];

    for (const [, command] of this.commands) {
      if (command.id === 'image') continue;

      if (command.id === 'text') {
        for (const [, inner] of command.children) {
          payload.push({
            name: inner.name,
            description: inner.description ?? 'No description',
            options: inner.children
              .map(c => c.slashCommandData)
              .concat(inner.arguments.map(a => a.slashCommandData)),
            defaultPermission: true
          });
        }

        continue;
      }

      payload.push({
        name: command.name,
        description: command.description ?? 'No description',
        options: command.children
          .map(c => c.slashCommandData)
          .concat(command.arguments.map(a => a.slashCommandData)),
        defaultPermission: true
      });
    }

    await this.application!.commands.set(payload);
  }

  public async load() {
    await this.database.init();
    await this.profile.init();
    await this.server.init();
  }

  public async ready() {
    this.guild = this.guilds.forge(this.config.guild);

    await this.registerSlashCommands();

    this._readied();
    this.initializeLoop();

    this.user!.setPresence({
      activities: [
        { type: 'PLAYING', name: `2.0 | Shard #${this.shard!.ids[0]}` }
      ],
      shardId: this.shard!.ids[0]
    });

    console.log(
      `[ \x1b[1m\x1b[36mShard ${
        this.shard!.ids[0]
      }\x1b[0m ] Connected as \x1b[1m\x1b[35m${this.user!.username}\x1b[0m`
    );
  }
}