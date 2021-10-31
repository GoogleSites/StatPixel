import type { TextChannel } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class SkyWars extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('sw');
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

    this.description = 'Retrieves the SkyWars statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatSkyWars(player);

    this.client.util.scroller(channel as TextChannel, author, {
      reply: id,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ SkyWars`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      },
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png',
      description: `Level: **${data.overall.level}**
Coins: **${this.client.util.formatNumber(data.overall.coins)}** 🪙`,
      fields: [
        {
          name: 'General 📰',
          value: `Wins: **${this.client.util.formatNumber(data.overall.wins)}**
Losses: **${this.client.util.formatNumber(data.overall.losses)}**
W/L: **${this.client.util.formatNumber(data.overall.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.overall.kills)}**
Deaths: **${this.client.util.formatNumber(data.overall.deaths)}**
K/D: **${this.client.util.formatNumber(data.overall.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.overall.heads)}**`,
          inline: true
        },
        {
          name: 'Solo Normal 🤺',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_normal.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_normal.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_normal.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_normal.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_normal.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_normal.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.solo_normal.heads)}**`,
          inline: true
        },
        {
          name: 'Teams Normal 🧑‍🤝‍🧑',
          value: `Wins: **${this.client.util.formatNumber(
            data.teams_normal.wins
          )}**
Losses: **${this.client.util.formatNumber(data.teams_normal.losses)}**
W/L: **${this.client.util.formatNumber(data.teams_normal.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.teams_normal.kills)}**
Deaths: **${this.client.util.formatNumber(data.teams_normal.deaths)}**
K/D: **${this.client.util.formatNumber(data.teams_normal.kill_death_ratio)}**

Heads: **${this.client.util.formatNumber(data.teams_normal.heads)}**`,
          inline: true
        },
        {
          name: 'Mega 💥',
          value: `Wins: **${this.client.util.formatNumber(data.mega.wins)}**
Losses: **${this.client.util.formatNumber(data.mega.losses)}**
W/L: **${this.client.util.formatNumber(data.mega.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.mega.kills)}**
Deaths: **${this.client.util.formatNumber(data.mega.deaths)}**
K/D: **${this.client.util.formatNumber(data.mega.kill_death_ratio)}**`,
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
          name: 'Teams Insane 🧑‍🤝‍🧑',
          value: `Wins: **${this.client.util.formatNumber(
            data.teams_insane.wins
          )}**
Losses: **${this.client.util.formatNumber(data.teams_insane.losses)}**
W/L: **${this.client.util.formatNumber(data.teams_insane.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.teams_insane.kills)}**
Deaths: **${this.client.util.formatNumber(data.teams_insane.deaths)}**
K/D: **${this.client.util.formatNumber(data.teams_insane.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Lucky 🍀',
          value: `Wins: **${this.client.util.formatNumber(data.lucky.wins)}**`,
          inline: true
        },
        {
          name: 'Rush ⏩',
          value: `Wins: **${this.client.util.formatNumber(data.rush.wins)}**`,
          inline: true
        }
      ]
    });

    return null;
  }
}
