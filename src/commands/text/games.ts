import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { inPlaceSort } from 'fast-sort';
import type { GameEntry, Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class Games extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('game', 'playtime', 'recent', 'recentgames', 'rg');
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

    this.description = 'Retrieves the game statistics of a player';
  }

  private calculateGameDiversity(games: number) {
    return games < 3 ? 'Low' : games < 6 ? 'Medium' : 'High';
  }

  public async run(
    { _settings }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const recent = await this.client.hypixel.recentGames(player.uuid);

    if (recent.length === 0) {
      return {
        embed: {
          author: {
            name: `${this.client.hutil.computeDisplayName(player)} ➢ Games`,
            icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
          },
          fields: [
            {
              name: 'Most Popular',
              value: 'None',
              inline: true
            },
            {
              name: 'Diversity',
              value: `**Low** (0 unique games)`,
              inline: true
            },
            {
              name: 'Total',
              value: `**0** hours`,
              inline: true
            },
            {
              name: 'Played',
              value: '0 games',
              inline: true
            },
            {
              name: 'Average Time',
              value: '0 minutes per game',
              inline: true
            },
            {
              name: 'Longest',
              value: 'None',
              inline: true
            }
          ]
        }
      };
    }

    let total = 0,
      longestGame: null | GameEntry = null,
      shortestGame: null | GameEntry = null,
      longestValue = 0,
      shortestValue = Infinity;

    const content: { [key: string]: number } = {};
    const chart = new ChartJSNodeCanvas({ width: 900, height: 325 });

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    for (const game of recent) {
      const playtime = game.ended - game.date;

      total += playtime;

      if (longestValue < playtime) {
        longestValue = playtime;
        longestGame = game;
      }

      if (shortestValue > playtime) {
        shortestValue = playtime;
        shortestGame = game;
      }

      if (content[game.gameType]) content[game.gameType] += playtime;
      else content[game.gameType] = playtime;
    }

    const data = Object.entries(content);
    const games = data.length;

    inPlaceSort(data).desc(g => g[1]);

    if (data.length > 10) data.splice(10, data.length - 10);

    const palette = this.client.util.createPalette(
      _settings.colour,
      data.length
    );

    const buffer = await chart.renderToBuffer({
      type: 'pie',
      data: {
        labels: data.map(d => this.client.hutil.formatGameName(d[0])),
        datasets: [
          {
            data: data.map(d => d[1]),
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

    return {
      files: [
        {
          attachment: buffer,
          name: 'pie.png'
        }
      ],
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(player)} ➢ Games`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        image: {
          url: 'attachment://pie.png'
        },
        fields: [
          {
            name: 'Most Popular',
            value: `**${this.client.hutil.formatGameName(
              data[0][0]
            )}** (${this.client.util.formatNumber(
              data[0][1] / 1000 / 60 / 60
            )} hours)`,
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
            value: `**${this.client.util.formatNumber(
              total / 1000 / 60 / 60
            )}** hours`,
            inline: true
          },
          {
            name: 'Average',
            value: `${this.client.util.formatNumber(
              total / recent.length / 1000 / 60
            )} minutes per game`,
            inline: true
          },
          {
            name: 'Longest',
            value: `**${this.client.hutil.formatGameName(
              longestGame!.gameType
            )}** with ${this.client.util.formatNumber(
              longestValue / 1000 / 60
            )} minutes on **${longestGame!.map}**`,
            inline: true
          },
          {
            name: 'Shortest',
            value: `**${this.client.hutil.formatGameName(
              shortestGame!.gameType
            )}** with ${this.client.util.formatNumber(
              shortestValue / 1000 / 60
            )} minutes on **${shortestGame!.map}**`,
            inline: true
          }
        ]
      }
    };
  }
}
