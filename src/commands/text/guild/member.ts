import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { inPlaceSort } from 'fast-sort';
import type { Guild } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions, StoredGuild } from '../../../typings';

export default class Member extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelGuild(
            author.id,
            { byMember: true, includeMember: true },
            a
          ),
        "You did not provide a valid guild member, or you don't have a linked account.\n\n**TIP**: To link an account, use `{prefix}link <username>`.",
        { overwrite: true, remaining: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the guild member statistics';
  }

  public async run(
    { _settings }: Message,
    { guild, uuid, username }: { guild: Guild; uuid: string; username: string }
  ): Promise<MessageOptions | string | null> {
    let buffer: Buffer | null = null;

    const member = guild.members.find(m => m.uuid === uuid)!;
    const importance = guild.ranks.find(r => r.name === member.rank);
    const ranks = inPlaceSort([
      ...new Set(guild.ranks.map(r => r.priority))
    ]).desc();
    const days = Object.keys(member.expHistory).reverse();
    const stored: StoredGuild =
      await this.client.database.hypixel_guilds.findOne({
        id: guild._id
      });

    const chart = new ChartJSNodeCanvas({ width: 900, height: 600 });

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    if (_settings.chart) {
      const now = Date.now();

      let highestExperience = 0;

      const membersByRole = Object.entries(
        guild.members.reduce(
          (
            a: {
              [key: string]: {
                quest: number;
                joined: number;
                experience: number;
              }[];
            },
            m
          ) => {
            const role = m.uuid === uuid ? username.toUpperCase() : 'OTHER';
            const days = Math.ceil((now - m.joined) / 86400000);

            const data = {
              quest: (m.questParticipation ?? 0) / Math.max(days, 1),
              joined: m.joined,
              experience:
                Object.values(m.expHistory).reduce((a, b) => a + b, 0) / 7
            };

            if (highestExperience < data.experience)
              highestExperience = data.experience;

            if (a[role]) a[role].push(data);
            else a[role] = [data];

            return a;
          },
          {}
        )
      );

      inPlaceSort(membersByRole).asc(m => m[1].length);

      const [r, g, b] = this.client.util.hexToRgb(_settings.colour);
      buffer = await chart.renderToBuffer({
        type: 'bubble',
        data: {
          datasets: membersByRole.map(([label, data], i) => ({
            backgroundColor:
              i === 0
                ? `rgba(${r}, ${g}, ${b}, 0.5)`
                : 'rgba(255, 255, 255, 0.5)',
            label,
            borderColor:
              i === 0 ? `rgb(${r}, ${g}, ${b})` : 'rgb(255, 255, 255)',
            data: data.map(m => ({
              x: m.joined,
              y: m.quest,
              r: 30 * Math.max(m.experience / highestExperience, 0.1)
            }))
          }))
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 20
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Average Daily Quests',
                font: {
                  family: 'Courier New',
                  weight: 'bold',
                  size: 25
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Join Date',
                font: {
                  family: 'Courier New',
                  weight: 'bold',
                  size: 25
                }
              },
              ticks: {
                display: false,
                // @ts-ignore
                maxTicksLimit: 7,
                font: {
                  size: 20
                }
              },
              type: 'timeseries',
              time: {
                displayFormats: {
                  millisecond: 'MMM D YYYY',
                  second: 'MMM D YYYY',
                  minute: 'MMM D YYYY',
                  hour: 'MMM D YYYY',
                  day: 'MMM D YYYY',
                  week: 'MMM D YYYY',
                  month: 'MMM D YYYY',
                  quarter: 'MMM D YYYY',
                  year: 'MMM D YYYY'
                }
              }
            }
          }
        }
      });
    } else {
      const data = [
        {
          data: [] as number[],
          label: 'Daily'
        },
        {
          data: [] as number[],
          label: 'Total'
        }
      ];

      for (const day of days) {
        const experience = member.expHistory[day];

        data[0].data.push(experience);
        data[1].data.push(
          data[1].data.length === 0
            ? experience
            : data[1].data[data[1].data.length - 1] + experience
        );
      }

      const palette = this.client.util.createPalette(_settings.colour, 2);

      buffer = await chart.renderToBuffer({
        type: 'line',
        data: {
          labels: days.map(d => d.slice(5)),
          datasets: data.map(({ label, data }, i) => ({
            backgroundColor: `rgba(${palette[i]}, 0.5)`,
            label,
            borderColor: `rgb(${palette[i]})`,
            data: data,
            fill: 'start',
            tension: 0.4,
            spanGaps: true
          }))
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 20
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Experience',
                font: {
                  family: 'Courier New',
                  weight: 'bold',
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
    }

    return {
      files: [
        {
          attachment: buffer,
          name: 'chart.png'
        }
      ],
      embed: {
        fields: [
          {
            name: 'Joined',
            value: `<t:${Math.floor(member.joined / 1000)}:R>`,
            inline: true
          },
          {
            name: 'Quests Completed',
            value: this.client.util.formatNumber(member.questParticipation),
            inline: true
          },
          {
            name: 'Rank',
            value: `**${member.rank}** (${
              importance === undefined
                ? 'highest'
                : `${this.client.util.formatToOrdinal(
                    ranks.indexOf(importance.priority) + 2
                  )} highest`
            })`,
            inline: true
          },
          {
            name: 'Daily Experience',
            value: days
              .slice(0, 4)
              .map(
                k =>
                  `\`${k}\`: **${this.client.util.formatNumber(
                    member.expHistory[k]
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
                    member.expHistory[k]
                  )}**`
              )
              .join('\n'),
            inline: true
          }
        ],
        description: _settings.chart
          ? `This bubble chart shows the general activity of a guild.

Here's a quick summary:
\`-\` Each bubble is a guild member, coloured by their guild role.
\`-\` Bubbles closer to the left are older members.
\`-\` Bubbles closer to the top complete more quests.
\`-\` Bubble size is based on average daily experience.

If the text is hard to read, simply click on the image to enlarge it.`
          : `**TIP**: To enable charts, use \`${_settings.prefix}chart\`.`,
        author: {
          name: `${guild.name}${
            guild.tag ? ` [${guild.tag.replace(/§\w/g, '')}]` : ''
          } ➢ ${username}`,
          icon_url: `https://crafatar.com/avatars/${uuid}?overlay`
        },
        thumbnail: {
          url: stored.icon
        },
        image: {
          url: 'attachment://chart.png'
        }
      }
    };
  }
}
