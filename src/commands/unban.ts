import type { User } from 'discord.js-light';
import { Util } from 'discord.js-light';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

const SNOWFLAKE_REGEX = /^\d{17,19}$/;

export default class Unban extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.admin = true;
    this.arguments = [
      new Argument(
        'user',
        'The snowflake identifier of a user',
        async (a: string) =>
          SNOWFLAKE_REGEX.test(a) &&
          (await this.client.users.fetch(a as `${bigint}`)),
        'You did not provide a valid user id.',
        { overwrite: true }
      )
    ];

    this.description = 'Unbans a user from using StatPixel';
  }

  public async run(
    _: Message,
    user: User
  ): Promise<MessageOptions | string | null> {
    await this.client.database.users.updateOne(
      {
        discord_id: user.id
      },
      {
        $set: {
          banned_until: null
        }
      },
      { upsert: true }
    );

    return {
      embed: {
        author: {
          name: user.tag,
          icon_url: user.displayAvatarURL({ dynamic: true })
        },
        description: `**${Util.escapeMarkdown(
          user.username
        )}** has been unbanned.`
      }
    };
  }
}
