import type { EmbedFieldData, TextChannel } from 'discord.js-light';
import type { SkyblockProfile } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import { numbers } from '../../../emojis';
import type { Message, MessageOptions } from '../../../typings';

export default class Dungeons extends BaseCommand {
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

    this.description = 'Retrieves the SkyBlock dungeon statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
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

    const member = profile.members[uuid];
    const fields = [] as EmbedFieldData[];

    for (const name in member.dungeons?.dungeon_types ?? {}) {
      const dungeon = member.dungeons.dungeon_types[name];

      for (const floor in dungeon.best_runs) {
        const runs: {
          score_exploration: number;
          score_speed: number;
          score_skill: number;
          score_bonus: number;
          timestamp: number;
        }[] = dungeon.best_runs[floor];

        fields.push({
          name: `Floor ${numbers[parseInt(floor)]}${
            name === 'master_catacombs' ? ' (Master)' : ''
          }`,
          value:
            runs
              .map(
                (r, i) =>
                  `\`${i + 1}\`. **${
                    r.score_exploration +
                    r.score_speed +
                    r.score_skill +
                    r.score_bonus
                  }** (<t:${Math.floor(r.timestamp / 1000)}:R>)`
              )
              .join('\n') || 'No runs present.',
          inline: true
        });
      }
    }

    this.client.util.scroller(channel as TextChannel, author, {
      reply: id,
      description: fields.length === 0 ? 'No dungeon data.' : undefined,
      maxFields: 6,
      title: {
        name: `${this.client.hutil.computeDisplayName(
          player
        )} ➢ SkyBlock ➢ Dungeons`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      },
      fields
    });

    return null;
  }
}
