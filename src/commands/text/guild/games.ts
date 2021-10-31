import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { inPlaceSort } from 'fast-sort';
import type { Guild } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions, StoredGuild } from '../../../typings';

export default class Games extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'name',
        'The name of a guild on Hypixel',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelGuild(author.id, {}, a),
        'You did not provide a valid guild name, or you do not have a linked account that is in a guild.\n\n**TIP**: To link an account, use `{prefix}link <username>`.',
        { overwrite: true, remaining: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the game statistics of a guild';
  }

  private calculateGameDiversity(games: number) {
    return games < 4 ? 'Low' : games < 10 ? 'Medium' : 'High';
  }

  public async run(
    { _settings }: Message,
    guild: Guild
  ): Promise<MessageOptions | string | null> {
    let total = 0;

    const data: { label: string; value: number }[] = [];
    const chart = new ChartJSNodeCanvas({ width: 900, height: 325 });

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    for (const game in guild.guildExpByGameType) {
      const experience = guild.guildExpByGameType[game];

      if (experience > 0) {
        total += experience;

        data.push({ label: game, value: experience });
      }
    }

    inPlaceSort(data).desc(g => g.value);

    const games = data.length;

    if (data.length > 10) data.splice(10, data.length - 10);

    const palette = this.client.util.createPalette(
      _settings.colour,
      data.length
    );

    const buffer = await chart.renderToBuffer({
      type: 'pie',
      data: {
        labels: data.map(d => this.client.hutil.formatGameName(d.label)),
        datasets: [
          {
            data: data.map(d => d.value),
            backgroundColor: palette.map(p => `rgba(${p}, 0.5)`),
            borderColor: palette.map(p => `rgb(${p})`)
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              font: {
                size: 20
              }
            }
          }
        }
      }
    });

    const leader = this.client.hutil.findGuildLeader(guild);
    const stored: StoredGuild =
      await this.client.database.hypixel_guilds.findOne({
        id: guild._id
      });

    return {
      files: [
        {
          attachment: buffer,
          name: 'pie.png'
        }
      ],
      embed: {
        author: {
          name: `${guild.name}${
            guild.tag ? ` [${guild.tag.replace(/§\w/g, '')}]` : ''
          } ➢ Games`,
          icon_url: leader
            ? `https://crafatar.com/avatars/${leader.uuid}?overlay`
            : 'https://i.imgur.com/TJELA4E.jpeg'
        },
        thumbnail: {
          url: stored.icon
        },
        image: {
          url: 'attachment://pie.png'
        },
        fields: [
          {
            name: 'Most Popular',
            value: `**${this.client.hutil.formatGameName(
              data[0].label
            )}** (${this.client.util.formatNumber(data[0].value)} XP)`,
            inline: true
          },
          {
            name: 'Diversity',
            value: `**${this.calculateGameDiversity(
              games
            )}** (${games} unique game${games === 1 ? '' : 's'})`,
            inline: true
          },
          {
            name: 'Total',
            value: `**${this.client.util.formatNumber(total)}** XP`,
            inline: true
          }
        ]
      }
    };
  }
}
