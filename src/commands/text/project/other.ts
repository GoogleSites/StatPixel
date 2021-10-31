import { Util } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions, UserHistory } from '../../../typings';

export default class Other extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'path',
        'The path to project in dot-notation',
        Argument.isPresent,
        'You must provide a path to the statistic that you want to project.',
        {
          remaining: true,
          overwrite: true
        }
      ),
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelProfile(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      )
    ];

    this.description = 'Projects arbitrary statistics of a player';
  }

  public async run(
    _: Message,
    key: string,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const comma = key.replace(/\./g, ',');
    const history: UserHistory = await this.client.database.history.findOne({
      uuid: player.uuid
    });

    const entries = history.data[comma];

    if (entries === undefined) {
      const { success, type } = await this.client.profile.addHistory(
        player,
        comma
      );

      if (success)
        throw `Data tracking for **${Util.escapeMarkdown(
          player.displayname
        )}** did not include \`${key}\`. It has been added.
Their earliest projection will be available in **${this.client.util.timeUntilCron(
          `0 */${history.period} * * *`,
          2
        )}**.
  
**NOTE**: Data only updates if it has changed, so they must be actively playing during this time.`;

      throw `You can only project data that is a \`number\`. The value at \`${key}\` is of type \`${type}\`, so it cannot be projected.`;
    }

    if (entries.length < 2) {
      throw `Data tracking for \`${key}\` for **${Util.escapeMarkdown(
        player.displayname
      )}** is not ready yet.
Their earliest projection will be available in **${this.client.util.timeUntilCron(
        `0 */${history.period} * * *`,
        2 - entries.length
      )}**.

**NOTE**: Data only updates if it has changed, so they must be actively playing during this time.`;
    }

    const model = this.client.profile.project(entries);
    const now = Math.floor(Date.now() / 1000);

    const day = model.estimate(2, now + 86400);
    const week = model.estimate(2, now + 86400 * 7);
    const month = model.estimate(2, now + 86400 * 30);

    return {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(
            player
          )} ➢ Other Projection`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        description: `${
          entries.length < 10
            ? `**NOTE**: This projection may be inaccurate due to a lack of data. It will improve over time.\n\n`
            : ''
        }These are the projected statistics for \`${key}\`.`,
        fields: [
          {
            name: 'In a day',
            value: this.client.util.formatNumber(day),
            inline: true
          },
          {
            name: 'In a week',
            value: this.client.util.formatNumber(week),
            inline: true
          },
          {
            name: 'In a month',
            value: this.client.util.formatNumber(month),
            inline: true
          }
        ]
      }
    };
  }
}
