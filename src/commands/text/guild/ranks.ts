import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { inPlaceSort } from 'fast-sort';
import type { Guild } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions, StoredGuild } from '../../../typings';

export default class Ranks extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('roles', 'rank', 'role');
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

    this.description = 'Retrieves the rank statistics of a guild';
  }

  public async run(
    { _settings }: Message,
    guild: Guild
  ): Promise<MessageOptions | string | null> {
    let popularName: string | null = null,
      popularValue = 0;

    const membersByRole = Object.entries(
      guild.members.reduce(
        (
          a: {
            [key: string]: {
              members: number;
              priority: number;
            };
          },
          m
        ) => {
          const role = m.rank.toUpperCase();

          if (a[role]) ++a[role].members;
          else
            a[role] = {
              members: 1,
              priority:
                guild.ranks.find(r => r.name.toUpperCase() === role)
                  ?.priority ?? Infinity
            };

          if (a[role].members > popularValue) {
            popularValue = a[role].members;
            popularName = role;
          }

          return a;
        },
        {}
      )
    );

    inPlaceSort(membersByRole).desc(g => g[1].priority);

    const chart = new ChartJSNodeCanvas({ width: 900, height: 325 });

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    const palette = this.client.util.createPalette(
      _settings.colour,
      membersByRole.length
    );
    const buffer = await chart.renderToBuffer({
      type: 'bar',
      data: {
        labels: membersByRole.map(r => r[0]),
        datasets: [
          {
            data: membersByRole.map(r => r[1].members),
            backgroundColor: palette.map(p => `rgba(${p}, 0.5)`),
            borderColor: palette.map(p => `rgb(${p})`)
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
            position: 'top',
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
            text: 'Members by Rank'
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
          name: 'bar.png'
        }
      ],
      embed: {
        author: {
          name: `${guild.name}${
            guild.tag ? ` [${guild.tag.replace(/§\w/g, '')}]` : ''
          } ➢ Ranks`,
          icon_url: leader
            ? `https://crafatar.com/avatars/${leader.uuid}?overlay`
            : 'https://i.imgur.com/TJELA4E.jpeg'
        },
        thumbnail: {
          url: stored.icon
        },
        image: {
          url: 'attachment://bar.png'
        },
        fields: [
          {
            name: 'Ranks',
            value: `${membersByRole.length} ranks`,
            inline: true
          },
          {
            name: 'Common Role',
            value: `**${popularName}** (${popularValue} member${
              popularValue === 1 ? '' : 's'
            })`,
            inline: true
          }
        ]
      }
    };
  }
}
