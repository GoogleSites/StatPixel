import { Util } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions, UserHistory } from '../../../typings';

export default class BedWars extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelProfile(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      )
    ];

    this.aliases.push('bw');
    this.description = 'Projects BedWars statistics of a player';
  }

  public async run(
    _: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const history: UserHistory = await this.client.database.history.findOne({
      uuid: player.uuid
    });

    const entries = history.data['stats,Bedwars,Experience'];

    if (entries.length < 2) {
      throw `Data tracking for **${Util.escapeMarkdown(
        player.displayname
      )}** is not ready yet.
Their earliest projection will be available in **${this.client.util.timeUntilCron(
        `0 */${history.period} * * *`,
        2 - entries.length
      )}**.

**NOTE**: Data only updates if it has changed, so they must be actively playing during this time.`;
    }

    const data = this.client.hutil.formatBedWars(player);
    const level = this.client.hutil.calculateBedWarsLevel(
      data.overall.experience
    );
    const nextPrestige =
      level % 100 === 0 ? level + 100 : Math.ceil(level / 100) * 100;

    const levelModel = this.client.profile.project(
      history.data['stats,Bedwars,Experience'],
      1
    );
    const timestamp = levelModel.estimateX(
      1,
      this.client.hutil.calculateBedWarsExperience(nextPrestige)
    )!;

    const projected = this.client.profile.projectDataAt(
      history,
      timestamp,
      [
        'stats,Bedwars,final_kills_bedwars',
        'stats,Bedwars,final_deaths_bedwars',
        'stats,Bedwars,beds_broken_bedwars',
        'stats,Bedwars,wins_bedwars',
        'stats,Bedwars,losses_bedwars'
      ],
      1
    );

    projected.final_kill_death_ratio = this.client.util.divide(
      projected['stats,Bedwars,final_kills_bedwars'],
      projected['stats,Bedwars,final_deaths_bedwars']
    );
    projected.win_loss_ratio = this.client.util.divide(
      projected['stats,Bedwars,wins_bedwars'],
      projected['stats,Bedwars,losses_bedwars']
    );

    return {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(
            player
          )} ➢ BedWars Projection`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        thumbnail: {
          url: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png'
        },
        description: `Projected to reach **${nextPrestige}** ⭐ <t:${Math.floor(
          timestamp
        )}:R>, based off of **${entries.length}** snapshots of their data.${
          entries.length < 10
            ? `\n
**NOTE**: This projection may be inaccurate due to a lack of data. It will improve over time.`
            : ''
        }

These are their projected statistics at **${nextPrestige}** ⭐.`,
        fields: [
          {
            name: 'Final Kills',
            value: this.client.util.formatNumber(
              projected['stats,Bedwars,final_kills_bedwars'],
              0
            ),
            inline: true
          },
          {
            name: 'Beds Broken',
            value: this.client.util.formatNumber(
              projected['stats,Bedwars,beds_broken_bedwars'],
              0
            ),
            inline: true
          },
          {
            name: 'F. K/D',
            value: this.client.util.formatNumber(
              projected.final_kill_death_ratio
            ),
            inline: true
          },
          {
            name: 'Wins',
            value: this.client.util.formatNumber(
              projected['stats,Bedwars,wins_bedwars'],
              0
            ),
            inline: true
          },
          {
            name: 'Losses',
            value: this.client.util.formatNumber(
              projected['stats,Bedwars,losses_bedwars'],
              0
            ),
            inline: true
          },
          {
            name: 'W/L',
            value: this.client.util.formatNumber(projected.win_loss_ratio),
            inline: true
          }
        ]
      }
    };
  }
}
