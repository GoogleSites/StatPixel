import fs from 'fs/promises';
import path from 'path';

import { Util } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';
import { ObjectId } from 'mongodb';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions, User } from '../typings';

const MINECRAFT_USERNAME_REGEX = /^\w{1,16}$/;

export default class Link extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('sync', 'register');
    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        async (a: string) =>
          a && MINECRAFT_USERNAME_REGEX.test(a) ? this.client.hypixel.player(a) : null,
        'You must provide a valid Minecraft username to link.',
        { overwrite: true }
      )
    ];

    this.description = 'Link yourself to a Minecraft account';
  }

  public async run(
    { author, _settings }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const now = Date.now();
    const id = new ObjectId();

    const { value }: { value?: User } =
      await this.client.database.users.findOneAndUpdate(
        {
          discord_id: author.id
        },
        {
          $set: {
            uuid: player.uuid,
            verified: false,
            active_session: 0,
            sessions: [
              {
                id,
                created_at: now
              }
            ],
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
            }
          },
          $setOnInsert: {
            _id: id
          }
        },
        { upsert: true }
      );

    if (!value) {
      await fs.writeFile(
        path.join(__dirname, '..', 'sessions', id.toHexString()),
        JSON.stringify(player)
      );
    } else {
      await Promise.allSettled(
        value.sessions.map(s =>
          fs.unlink(path.join(__dirname, '..', 'sessions', s.id.toHexString()))
        )
      );

      await fs.writeFile(
        path.join(__dirname, '..', 'sessions', value._id.toHexString()),
        JSON.stringify(player)
      );

      if (value.daily?.id && await this.client.database.users.countDocuments({
        daily: value.daily.id
      }) === 0) {
        await Promise.allSettled(
          [value.daily.id, value.weekly?.id!, value.monthly?.id!]
            .map(id => fs.unlink(path.join(__dirname, '..', 'sessions', id.toHexString())))
        );
      }
    }

    return {
      embed: {
        thumbnail: {
          url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        description: `You have linked to **${Util.escapeMarkdown(
          player.displayname
        )}**. This allows you to use shortcuts with our commands and view your statistics quicker. Go ahead, give it a try!

\`1\`. Use \`${_settings.prefix}profile\` to view your profile.
\`2\`. Use \`${
          _settings.prefix
        }[gamemode]\` to view your statistics for a gamemode.
\`3\`. Use \`${_settings.prefix}friends\` to view your friends list.

**Something not right? [Join our support server](https://discord.gg/AuUhAHMGeE)!**`
      }
    };
  }
}
