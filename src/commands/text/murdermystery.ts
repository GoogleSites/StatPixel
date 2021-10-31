import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class MurderMystery extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('mm', 'mmystery');
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

    this.description = 'Retrieves the Murder Mystery statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatMurderMystery(player);

    this.client.util.scroller(channel, author, {
      reply: id,
      fields: [
        {
          name: 'General 📰',
          value: `Wins: **${this.client.util.formatNumber(data.overall.wins)}**
Games: **${this.client.util.formatNumber(data.overall.games)}**

Kills: **${this.client.util.formatNumber(data.overall.kills)}**
Deaths: **${this.client.util.formatNumber(data.overall.deaths)}**
K/D: **${this.client.util.formatNumber(data.overall.kill_death_ratio)}**

Gold: **${this.client.util.formatNumber(data.overall.gold)}**`,
          inline: true
        },
        {
          name: 'Classic 🌴',
          value: `Wins: **${this.client.util.formatNumber(data.classic.wins)}**
Games: **${this.client.util.formatNumber(data.classic.games)}**

Kills: **${this.client.util.formatNumber(data.classic.kills)}**
Deaths: **${this.client.util.formatNumber(data.classic.deaths)}**
K/D: **${this.client.util.formatNumber(data.classic.kill_death_ratio)}**

Gold: **${this.client.util.formatNumber(data.classic.gold)}**`,
          inline: true
        },
        {
          name: 'Double Up 👫',
          value: `Wins: **${this.client.util.formatNumber(
            data.double_up.wins
          )}**
Games: **${this.client.util.formatNumber(data.double_up.games)}**

Kills: **${this.client.util.formatNumber(data.double_up.kills)}**
Deaths: **${this.client.util.formatNumber(data.double_up.deaths)}**
K/D: **${this.client.util.formatNumber(data.double_up.kill_death_ratio)}**

Gold: **${this.client.util.formatNumber(data.double_up.gold)}**`,
          inline: true
        },
        {
          name: 'Assassins 🥷',
          value: `Wins: **${this.client.util.formatNumber(
            data.assassins.wins
          )}**
Games: **${this.client.util.formatNumber(data.assassins.games)}**

Kills: **${this.client.util.formatNumber(data.assassins.kills)}**
Deaths: **${this.client.util.formatNumber(data.assassins.deaths)}**
K/D: **${this.client.util.formatNumber(data.assassins.kill_death_ratio)}**

Gold: **${this.client.util.formatNumber(data.assassins.gold)}**`,
          inline: true
        },
        {
          name: 'Showdown 🔫',
          value: `Wins: **${this.client.util.formatNumber(data.showdown.wins)}**
Games: **${this.client.util.formatNumber(data.showdown.games)}**

Kills: **${this.client.util.formatNumber(data.showdown.kills)}**
Deaths: **${this.client.util.formatNumber(data.showdown.deaths)}**
K/D: **${this.client.util.formatNumber(data.showdown.kill_death_ratio)}**

Gold: **${this.client.util.formatNumber(data.showdown.gold)}**`,
          inline: true
        },
        {
          name: 'Infection 🧪',
          value: `Wins: **${this.client.util.formatNumber(
            data.infection.wins
          )}**
Games: **${this.client.util.formatNumber(data.infection.games)}**

Kills: **${this.client.util.formatNumber(data.infection.kills)}**
Deaths: **${this.client.util.formatNumber(data.infection.deaths)}**
K/D: **${this.client.util.formatNumber(data.infection.kill_death_ratio)}**

Gold: **${this.client.util.formatNumber(data.infection.gold)}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/MurderMystery-64.png',
      description: `Coins: **${this.client.util.formatNumber(
        data.overall.coins
      )}** 🪙`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(
          player
        )} ➢ Murder Mystery`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
