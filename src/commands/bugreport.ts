import { CommandInteraction, Util } from 'discord.js-light';
import type { MessageReaction, TextChannel, User } from 'discord.js-light';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class BugReport extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('br', 'bug');
    this.arguments = [
      new Argument(
        'report',
        'A description of the bug',
        (a: string) => a.length <= 1000,
        'Your bug report must be within **1,000 characters**.'
      )
    ];

    this.description = 'Reports a bug to StatPixel';
  }

  private async next(): Promise<number> {
    const { value } = await this.client.database.static.findOneAndUpdate(
      {
        _id: this.client.config.static
      },
      {
        $inc: {
          bug_report_counter: 1
        }
      }
    );

    if (value.bug_report_counter === 1488) return this.next();

    return value.bug_report_counter;
  }

  public async run(
    { author, channel: origin, guild }: Message,
    body: string
  ): Promise<MessageOptions | string | null> {
    const channel = this.client.guild!.channels.forge(
      this.client.config.channels.bug_reports,
      'GUILD_TEXT'
    );
    const number = await this.next();
    const emojis = ['✅', '❌'];

    this.client.util.message(origin, {
      embed: {
        description: `Your bug report has been submitted. You will recieve a **direct message** from me once it has been resolved.

Bug Report ID: **#${number}**`
      }
    });

    const fetched = (await (origin instanceof CommandInteraction
      ? origin.channel!
      : origin
    ).fetch()) as TextChannel;
    const message = await this.client.util.message(channel, {
      embed: {
        author: {
          name: `Bug report from ${author.tag}`,
          icon_url: author.displayAvatarURL({ dynamic: true })
        },
        description: body,
        fields:
          guild !== null
            ? [
                {
                  name: 'Server',
                  value: `**${Util.escapeMarkdown(guild.name)}** (${
                    guild.memberCount
                  } members)`,
                  inline: true
                },
                {
                  name: 'Channel',
                  value: `**#${Util.escapeMarkdown(fetched.name)}** (${
                    fetched.type
                  })`,
                  inline: true
                }
              ]
            : [
                {
                  name: 'Server',
                  value: '**Direct Message** (no members)',
                  inline: true
                }
              ]
      }
    });

    await this.client.addReactionHandler(message, 'bugReportResponse', {
      emojis,
      data: { id: author.id, number }
    });

    for (const emoji of emojis) {
      await message.react(emoji);
    }

    return null;
  }

  public async bugReportResponse(
    { message, emoji }: MessageReaction,
    user: User,
    { id, number }: { id: string; number: number }
  ) {
    await message.delete();

    return this.client.util.message(
      this.client.users.forge(id as `${bigint}`),
      {
        embed: {
          author: {
            name: `Resolved by ${user.tag}`,
            icon_url: user.displayAvatarURL({ dynamic: true })
          },
          description: `Your bug report (**#${number}**) has been marked as \`${
            emoji.name === '✅' ? 'completed' : 'invalid'
          }\`.`
        }
      }
    );
  }
}