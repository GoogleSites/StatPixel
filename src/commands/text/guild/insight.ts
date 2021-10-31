import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { inPlaceSort } from 'fast-sort';
import type { Guild } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions, StoredGuild } from '../../../typings';

export default class Insight extends BaseCommand {
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

    this.description = 'Displays insight on a guild';
  }

  public async run(
    { _settings }: Message,
    guild: Guild
  ): Promise<MessageOptions | string | null> {
    const chart = new ChartJSNodeCanvas({ width: 900, height: 600 });

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    const now = Date.now();
    const importance = new Map(
      guild.ranks.map(r => [r.name.toUpperCase(), r.priority])
    );

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
          const role = m.rank.toUpperCase();
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

    inPlaceSort(membersByRole).desc(m => importance.get(m[0]) ?? Infinity);

    const palette = this.client.util.createPalette(
      _settings.colour,
      membersByRole.length
    );

    const buffer = await chart.renderToBuffer({
      type: 'bubble',
      data: {
        datasets: membersByRole.map(([label, data], i) => ({
          backgroundColor: `rgba(${palette[i]}, 0.5)`,
          label,
          borderColor: `rgb(${palette[i]})`,
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

    const leader = this.client.hutil.findGuildLeader(guild);
    const stored: StoredGuild =
      await this.client.database.hypixel_guilds.findOne({
        id: guild._id
      });

    return {
      files: [
        {
          attachment: buffer,
          name: 'insight.png'
        }
      ],
      embed: {
        description: `This bubble chart shows the general activity of a guild.

Here's a quick summary:
\`-\` Each bubble is a guild member, coloured by their guild role.
\`-\` Bubbles closer to the left are older members.
\`-\` Bubbles closer to the top complete more quests.
\`-\` Bubble size is based on average daily experience.

If the text is hard to read, simply click on the image to enlarge it.`,
        author: {
          name: `${guild.name}${
            guild.tag ? ` [${guild.tag.replace(/§\w/g, '')}]` : ''
          } ➢ Insight`,
          icon_url: leader
            ? `https://crafatar.com/avatars/${leader.uuid}?overlay`
            : 'https://i.imgur.com/TJELA4E.jpeg'
        },
        thumbnail: {
          url: stored.icon
        },
        image: {
          url: 'attachment://insight.png'
        }
      }
    };
  }
}
