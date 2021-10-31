import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { SkyblockProfile } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default class SkyBlock extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchSkyblockProfiles(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the SkyBlock statistics of a player';
  }

  public async run(
    { author, channel, _settings }: Message,
    { profiles, uuid }: { profiles: SkyblockProfile[]; uuid: string }
  ): Promise<MessageOptions | string | null> {
    const player = await this.client.hypixel.player(uuid);
    const profile = await this.client.util.selectSkyblockProfile(
      author,
      channel,
      profiles,
      player
    );

    if (profile === null) return null;

    const member = profile.members[player.uuid];
    const chart = new ChartJSNodeCanvas({ width: 900, height: 600 });
    const palette = this.client.util.createPalette(_settings.colour, 4);

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    const datasets = [
      {
        label: 'Objectives',
        fill: true,
        spanGaps: true,
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: `rgba(${palette[0]}, 0.2)`,
        borderColor: `rgb(${palette[0]})`
      },
      {
        label: 'Quests',
        fill: true,
        spanGaps: true,
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: `rgba(${palette[1]}, 0.2)`,
        borderColor: `rgb(${palette[1]})`
      },
      {
        label: 'Upgrades',
        fill: true,
        spanGaps: true,
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: `rgba(${palette[2]}, 0.2)`,
        borderColor: `rgb(${palette[2]})`
      },
      {
        label: 'Dungeons',
        fill: true,
        spanGaps: true,
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: `rgba(${palette[3]}, 0.2)`,
        borderColor: `rgb(${palette[3]})`
      }
    ];

    for (const name in member.objectives) {
      const objective = member.objectives[name];

      if (objective.status !== 'COMPLETE') continue;

      ++datasets[0].data[new Date(objective.completed_at).getDay()];
    }

    for (const name in member.quests) {
      const quest = member.quests[name];

      if (quest.status === 'COMPLETE') {
        ++datasets[1].data[new Date(quest.activated_at).getDay()];
        ++datasets[1].data[new Date(quest.completed_at).getDay()];
      } else if (quest.status === 'ACTIVE') {
        ++datasets[1].data[new Date(quest.activated_at).getDay()];
      }
    }

    for (const upgrade of profile.community_upgrades.upgrade_states) {
      if (upgrade.started_by === uuid)
        ++datasets[2].data[new Date(upgrade.started_ms).getDay()];

      if (upgrade.claimed_by === uuid)
        ++datasets[2].data[new Date(upgrade.claimed_ms).getDay()];
    }

    if (member.dungeons.dungeon_types) {
      for (const type in member.dungeons.dungeon_types) {
        const dungeon = member.dungeons.dungeon_types[type];

        for (const floor in dungeon.best_runs) {
          for (const run of dungeon.best_runs[floor]) {
            ++datasets[3].data[new Date(run.timestamp).getDay()];
          }
        }
      }
    }

    for (const dataset of datasets) {
      this.client.util.normalize(dataset.data);
    }

    const buffer = await chart.renderToBuffer({
      type: 'radar',
      data: {
        labels: days,
        datasets
      },
      options: {
        scales: {
          r: {
            ticks: {
              maxTicksLimit: 1
            },
            pointLabels: {
              font: {
                size: 20
              }
            }
          }
        },
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
          },
          title: {
            display: true,
            text: 'Activity',
            font: {
              family: 'Courier New',
              weight: 'bold',
              size: 25
            }
          }
        }
      }
    });

    const quests = Object.values(member.quests).reduce(
      (a, b) => {
        if (b.status === 'ACTIVE') ++a.active;
        else ++a.completed;

        return a;
      },
      { completed: 0, active: 0 }
    );

    const objectives = Object.values(member.objectives).reduce(
      (a, b) => {
        if (b.status === 'ACTIVE') ++a.active;
        else ++a.completed;

        return a;
      },
      { completed: 0, active: 0 }
    );

    return {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(player)} ➢ SkyBlock ➢ ${
            profile.cute_name
          } ➢ Profile`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        description: !_settings.chart
          ? `**TIP**: To enable charts, use \`${_settings.prefix}chart\`.`
          : undefined,
        image: {
          url: _settings.chart ? 'attachment://activity.png' : undefined
        },
        fields: [
          {
            name: 'Coins',
            value: `${this.client.util.formatNumber(member.coin_purse)} 🪙`,
            inline: true
          },
          {
            name: 'Quests',
            value: `${this.client.util.formatNumber(
              quests.completed
            )} completed, ${this.client.util.formatNumber(
              quests.active
            )} active`,
            inline: true
          },
          {
            name: 'Objectives',
            value: `${this.client.util.formatNumber(
              objectives.completed
            )} completed, ${this.client.util.formatNumber(
              objectives.active
            )} active`,
            inline: true
          }
        ]
      },
      files: _settings.chart
        ? [
            {
              attachment: buffer,
              name: 'activity.png'
            }
          ]
        : []
    };
  }
}
