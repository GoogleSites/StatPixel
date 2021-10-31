import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Util } from 'discord.js-light';
import { inPlaceSort } from 'fast-sort';
import type { Guild } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions, StoredGuild } from '../../typings';

export default class G extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelGuild(author.id, {}, a),
        'You did not provide a valid guild name, or you do not have a linked account that is in a guild.\n\n**TIP**: To link an account, use `{prefix}link <username>`.',
        { overwrite: true, remaining: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the general guild statistics';
  }

  public async run(
    { _settings }: Message,
    guild: Guild
  ): Promise<MessageOptions | string | null> {
    const importance = new Map(
      (guild.ranks ?? []).map(r => [r.name.toUpperCase(), r.priority])
    );
    const experienceByRank = guild.members.reduce(
      (
        a: {
          content: {
            [key: string]: {
              data: {
                [key: string]: number;
              };
              members: number;
            };
          };
          total: {
            [key: string]: number;
          };
        },
        b
      ) => {
        b.rank = b.rank.toUpperCase();

        if (a.content[b.rank]) {
          for (const key in b.expHistory) {
            a.content[b.rank].data[key] =
              (a.content[b.rank].data[key] ?? 0) + (b.expHistory[key] ?? 0);
            a.total[key] = (a.total[key] ?? 0) + (b.expHistory[key] ?? 0);
          }

          ++a.content[b.rank].members;
        } else {
          a.content[b.rank] = {
            data: b.expHistory,
            members: 1
          };

          for (const key in b.expHistory) {
            a.total[key] = (a.total[key] ?? 0) + (b.expHistory[key] ?? 0);
          }
        }

        return a;
      },
      { content: {}, total: {} }
    );

    const experienceAverageByRank = Object.entries(
      experienceByRank.content
    ).reduce(
      (
        a: {
          [key: string]: {
            [key: string]: number;
          };
        },
        b
      ) => {
        a[b[0]] = {};

        for (const day in b[1].data) {
          a[b[0]][day] = b[1].data[day] / b[1].members;
        }

        return a;
      },
      {}
    );

    const days = Object.keys(guild.members[0].expHistory);
    const ranks = Object.keys(experienceAverageByRank).length;
    const experienceAverage = days.reduce(
      (
        a: {
          [key: string]: number;
        },
        b
      ) => {
        let total = 0;

        for (const rank in experienceAverageByRank) {
          total += experienceAverageByRank[rank][b];
        }

        a[b] = total / ranks;

        return a;
      },
      {}
    );

    const chart = new ChartJSNodeCanvas({ width: 900, height: 400 });
    const palette = this.client.util.createPalette(_settings.colour, ranks);

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    const buffer = await chart.renderToBuffer({
      type: 'line',
      data: {
        labels: days.map(d => d.slice(5)).reverse(),
        datasets: inPlaceSort(Object.entries(experienceByRank.content))
          .desc(m => importance.get(m[0]) ?? Infinity)
          .map(([rank, entry], i) => {
            return {
              label: rank,
              data: Object.entries(entry.data)
                .reverse()
                .map(
                  e =>
                    (e[1] / entry.members / experienceAverage[e[0]] / ranks) *
                    100
                ),
              borderColor: `rgb(${palette[i]})`,
              backgroundColor: `rgba(${palette[i]}, 0.5)`,
              fill: 'start',
              tension: 0.4,
              borderCapStyle: 'butt',
              spanGaps: true
            };
          })
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        plugins: {
          legend: {
            reverse: true,
            display: true,
            position: 'right',
            labels: {
              font: {
                size: 20
              }
            }
          },
          title: {
            display: true,
            font: {
              family: 'Courier New',
              size: 25
            },
            text: 'Average Daily Experience by Guild Role'
          }
        },
        scales: {
          y: {
            max: 100,
            display: false,
            stacked: true,
            ticks: {
              font: {
                size: 25
              }
            }
          },
          x: {
            ticks: {
              maxTicksLimit: 7,
              font: {
                size: 25
              },
              padding: 0
            }
          }
        }
      }
    });

    const stored: StoredGuild =
      await this.client.database.hypixel_guilds.findOne({
        id: guild._id
      });

    const leaderMember = this.client.hutil.findGuildLeader(guild);
    const newestMember = guild.members.reduce((a, b) =>
      a.joined > b.joined ? a : b
    );

    const [leaderUsername, newestUsername] = await Promise.all([
      leaderMember
        ? this.client.hypixel.getUsername(leaderMember.uuid)
        : 'Unknown',
      this.client.hypixel.getUsername(newestMember.uuid)
    ]);

    const dailyExperience = guild.members.reduce(
      (a, b) => {
        for (const key of days) {
          a[key] += b.expHistory[key] ?? 0;
        }

        return a;
      },
      days.reduce((a: { [key: string]: number }, b) => ((a[b] = 0), a), {})
    );

    return {
      files: _settings.chart
        ? [
            {
              attachment: buffer,
              name: 'chart.png'
            }
          ]
        : [],
      embed: {
        author: {
          name: `${guild.name}${
            guild.tag ? ` [${guild.tag.replace(/§\w/g, '')}]` : ''
          } ➢ Information`,
          icon_url: leaderMember
            ? `https://crafatar.com/avatars/${leaderMember.uuid}?overlay`
            : 'https://i.imgur.com/TJELA4E.jpeg'
        },
        thumbnail: {
          url: stored.icon
        },
        image: {
          url: _settings.chart ? 'attachment://chart.png' : undefined
        },
        description: `${
          guild.description || 'No guild description available.'
        }${
          !_settings.chart
            ? `\n\n**TIP**: To enable charts, use \`${_settings.prefix}chart\`.`
            : ''
        }`,
        fields: [
          {
            name: 'Members',
            value: `**${guild.members.length}** members`,
            inline: true
          },
          {
            name: 'Leader',
            value: `**${Util.escapeMarkdown(leaderUsername)}**`,
            inline: true
          },
          {
            name: 'Newest Member',
            value: `**${Util.escapeMarkdown(newestUsername)}** (<t:${Math.floor(
              newestMember.joined / 1000
            )}:R>)`,
            inline: true
          },
          {
            name: 'Daily Experience',
            value: days
              .slice(0, 4)
              .map(
                k =>
                  `\`${k}\`: **${this.client.util.formatNumber(
                    dailyExperience[k]
                  )}**`
              )
              .join('\n'),
            inline: true
          },
          {
            name: '\u200b',
            value: days
              .slice(4)
              .map(
                k =>
                  `\`${k}\`: **${this.client.util.formatNumber(
                    dailyExperience[k]
                  )}**`
              )
              .join('\n'),
            inline: true
          }
        ]
      }
    };
  }
}
