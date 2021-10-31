import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class Bridge extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('bridgeduel');
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

    this.description = 'Retrieves the Bridge statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatBridge(player);

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
          name: 'Solo 🤺',
          value: `Wins: **${this.client.util.formatNumber(data.solo.wins)}**
Losses: **${this.client.util.formatNumber(data.solo.losses)}**
W/L: **${this.client.util.formatNumber(data.solo.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Doubles 👫',
          value: `Wins: **${this.client.util.formatNumber(data.doubles.wins)}**
Losses: **${this.client.util.formatNumber(data.doubles.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles.deaths)}**
K/D: **${this.client.util.formatNumber(data.doubles.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: '2v2v2v2 🤺',
          value: `Wins: **${this.client.util.formatNumber(data.four_two.wins)}**
Losses: **${this.client.util.formatNumber(data.four_two.losses)}**
W/L: **${this.client.util.formatNumber(data.four_two.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.four_two.kills)}**
Deaths: **${this.client.util.formatNumber(data.four_two.deaths)}**
K/D: **${this.client.util.formatNumber(data.four_two.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: '3v3v3v3 👫',
          value: `Wins: **${this.client.util.formatNumber(
            data.four_three.wins
          )}**
Losses: **${this.client.util.formatNumber(data.four_three.losses)}**
W/L: **${this.client.util.formatNumber(data.four_three.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.four_three.kills)}**
Deaths: **${this.client.util.formatNumber(data.four_three.deaths)}**
K/D: **${this.client.util.formatNumber(data.four_three.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Fours 👫',
          value: `Wins: **${this.client.util.formatNumber(data.fours.wins)}**
Losses: **${this.client.util.formatNumber(data.fours.losses)}**
W/L: **${this.client.util.formatNumber(data.fours.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.fours.kills)}**
Deaths: **${this.client.util.formatNumber(data.fours.deaths)}**
K/D: **${this.client.util.formatNumber(data.fours.kill_death_ratio)}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png',
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ Bridge`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
