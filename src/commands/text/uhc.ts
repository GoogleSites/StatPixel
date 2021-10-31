import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class UHC extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('ultrahardcore');
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

    this.description = 'Retrieves the UHC statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatUHC(player);

    this.client.util.scroller(channel, author, {
      reply: id,
      fields: [
        {
          name: 'General 📰',
          value: `Wins: **${this.client.util.formatNumber(data.overall.wins)}**

Kills: **${this.client.util.formatNumber(data.overall.kills)}**
Deaths: **${this.client.util.formatNumber(data.overall.deaths)}**
K/D: **${this.client.util.formatNumber(data.overall.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.overall.heads)}**`,
          inline: true
        },
        {
          name: 'Solo 🤺',
          value: `Wins: **${this.client.util.formatNumber(data.solo.wins)}**

Kills: **${this.client.util.formatNumber(data.solo.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.solo.heads)}**`,
          inline: true
        },
        {
          name: 'Teams 👫',
          value: `Wins: **${this.client.util.formatNumber(data.team.wins)}**

Kills: **${this.client.util.formatNumber(data.team.kills)}**
Deaths: **${this.client.util.formatNumber(data.team.deaths)}**
K/D: **${this.client.util.formatNumber(data.team.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.team.heads)}**`,
          inline: true
        },
        {
          name: 'Teams of 3 👨‍👩‍👦',
          value: `Wins: **${this.client.util.formatNumber(
            data.three_team.wins
          )}**

Kills: **${this.client.util.formatNumber(data.three_team.kills)}**
Deaths: **${this.client.util.formatNumber(data.three_team.deaths)}**
K/D: **${this.client.util.formatNumber(data.three_team.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.three_team.heads)}**`,
          inline: true
        },
        {
          name: 'Solo Brawl 💥',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_brawl.wins
          )}**

Kills: **${this.client.util.formatNumber(data.solo_brawl.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_brawl.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_brawl.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.solo_brawl.heads)}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/UHC-64.png',
      description: `Coins: **${this.client.util.formatNumber(
        data.overall.coins
      )}** 🪙
Score: **${this.client.util.formatNumber(data.overall.score)}** 🌟`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ UHC`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
