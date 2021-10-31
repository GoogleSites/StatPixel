import { Util } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';
import { INTERNAL_GAME_NAME_FORMAT } from '../../utils/HypixelUtil';

export default class Profile extends BaseCommand {
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

    this.description = 'Retrieves the the profile of a player';
  }

  public async run(
    _: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const [friends, status, guild] = await Promise.all([
      this.client.hypixel.friends(player.uuid),
      this.client.hypixel.status(player.uuid),
      this.client.hypixel.guild(player.uuid, 'player').catch(() => null)
    ]);

    const usernames = await Promise.all(
      friends
        .slice(0, guild === null ? 4 : 5)
        .map(async f =>
          Util.escapeMarkdown(
            await this.client.hypixel.getUsername(
              f[f.uuidReceiver === player.uuid ? 'uuidSender' : 'uuidReceiver']
            )
          )
        )
    );

    return {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(player)} ➢ Profile`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        fields: [
          {
            name: 'General 📰',
            value: `Status: ${
              status.online
                ? `🟢 (${INTERNAL_GAME_NAME_FORMAT[status.gameType]})`
                : '🔴'
            }\n${guild !== null ? `Guild: **${guild.name}**\n` : ''}AP: **${
              player.achievementPoints
            }**
Level: **${this.client.hutil.calculateNetworkLevel(player.networkExp, true)}**
First Login: <t:${Math.floor(player.firstLogin / 1000)}:f>
Last Login: <t:${Math.floor(player.lastLogin / 1000)}:R>`,
            inline: true
          },
          {
            name: 'Friends 🧑‍🤝‍🧑',
            value: `${usernames.join('\n')}${
              friends.length > usernames.length
                ? `\n... (${friends.length - usernames.length} more)`
                : ''
            }`,
            inline: true
          }
        ]
      }
    };
  }
}
