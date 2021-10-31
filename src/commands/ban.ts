import type { User } from 'discord.js-light';
import { Util } from 'discord.js-light';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

const SNOWFLAKE_REGEX = /^\d{17,19}$/;

export default class Ban extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.admin = true;
    this.arguments = [
      new Argument(
        'id',
        'The snowflake identifier of a user',
        async (a: string) =>
          SNOWFLAKE_REGEX.test(a) &&
          (await this.client.users.fetch(a as `${bigint}`)),
        'You did not provide a valid user id.',
        { overwrite: true }
      ),
      new Argument(
        'duration',
        'The duration of the ban',
        Argument.parseTime,
        'You did not provide a valid time.',
        {
          overwrite: true,
          optional: true
        }
      ),
      new Argument('reason', 'The reason for the ban', Argument.isPresent, '', {
        remaining: true,
        optional: true
      })
    ];

    this.description = 'Bans a user from using StatPixel';
  }

  public async run(
    _: Message,
    user: User,
    duration = Infinity,
    reason?: string
  ): Promise<MessageOptions | string | null> {
    if (this.client.config.admins.includes(user.id))
      throw `You are not allowed to ban **${Util.escapeMarkdown(user.tag)}**.`;

    const until = Date.now() + duration;

    await this.client.database.users.updateOne(
      {
        discord_id: user.id
      },
      {
        $set: {
          banned_until: until,
          ban_reason: reason
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
        description: `**${Util.escapeMarkdown(user.username)}** has been ${
          isFinite(until)
            ? `banned for <t:${Math.floor(until / 1000)}:R>**`
            : 'permanently banned'
        }${reason ? `for \`${reason}\`` : ''}.`
      }
    };
  }
}
