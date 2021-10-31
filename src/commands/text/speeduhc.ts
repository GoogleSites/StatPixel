import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class SpeedUHC extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('suhc', 'speedultrahardcore');
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

    this.description = 'Retrieves the SpeedUHC statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatSpeedUHC(player);

    this.client.util.scroller(channel, author, {
      reply: id,
      fields: [
        {
          name: 'General 📰',
          value: `Wins: **${this.client.util.formatNumber(data.overall.wins)}**
Losses: **${this.client.util.formatNumber(data.overall.losses)}**
W/L: **${this.client.util.formatNumber(data.overall.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.overall.kills)}**
Deaths: **${this.client.util.formatNumber(data.overall.deaths)}**
K/D: **${this.client.util.formatNumber(data.overall.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Solo Normal 🤺',
          value: `Wins: **${this.client.util.formatNumber(data.solo.wins)}**
Losses: **${this.client.util.formatNumber(data.solo.losses)}**
W/L: **${this.client.util.formatNumber(data.solo.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Teams Normal 👫',
          value: `Wins: **${this.client.util.formatNumber(data.team.wins)}**
Losses: **${this.client.util.formatNumber(data.team.losses)}**
W/L: **${this.client.util.formatNumber(data.team.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.team.kills)}**
Deaths: **${this.client.util.formatNumber(data.team.deaths)}**
K/D: **${this.client.util.formatNumber(data.team.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Solo Insane 🤺',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_insane.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_insane.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_insane.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_insane.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_insane.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_insane.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Teams Insane 👫',
          value: `Wins: **${this.client.util.formatNumber(
            data.team_insane.wins
          )}**
Losses: **${this.client.util.formatNumber(data.team_insane.losses)}**
W/L: **${this.client.util.formatNumber(data.team_insane.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.team_insane.kills)}**
Deaths: **${this.client.util.formatNumber(data.team_insane.deaths)}**
K/D: **${this.client.util.formatNumber(data.team_insane.kill_death_ratio)}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/UHC-64.png',
      description: `Salt: **${this.client.util.formatNumber(
        data.overall.salt
      )}** 🧂`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ Speed UHC`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
