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

    this.description =
      'Retrieves the weekly SkyWars session statistics of a player';
  }

  public async run(
    { author, channel, id: replyID }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } =
      await this.client.profile.findSessionOfType('weekly', player);
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatSkyWars(player);
    const sessionData = this.client.hutil.formatSkyWars(session);

    this.client.util.scroller(channel as TextChannel, author, {
      reply: replyID,
      footer: {
        timestamp: started,
        text: 'Session started',
        icon_url: this.client.config.embed.footer.icon_url
      },
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(
          player
        )} ➢ SkyWars (Weekly)`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      },
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png',
      description: `Level: **${data.overall.level}**
Coins: **${this.client.util.formatDifference(
        data.overall.coins,
        sessionData.overall.coins
      )}** 🪙`,
      fields: [
        {
          name: 'General 📰',
          value: `Wins: **${this.client.util.formatDifference(
            data.overall.wins,
            sessionData.overall.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.overall.losses,
            sessionData.overall.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.overall.win_loss_ratio,
            sessionData.overall.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.overall.kills,
            sessionData.overall.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.overall.deaths,
            sessionData.overall.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.overall.kill_death_ratio,
            sessionData.overall.kill_death_ratio
          )}**

Heads: **${this.client.util.formatDifference(
            data.overall.heads,
            sessionData.overall.heads
          )}**`,
          inline: true
        },
        {
          name: 'Solo Normal 🤺',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_normal.wins,
            sessionData.solo_normal.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_normal.losses,
            sessionData.solo_normal.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_normal.win_loss_ratio,
            sessionData.solo_normal.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_normal.kills,
            sessionData.solo_normal.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_normal.deaths,
            sessionData.solo_normal.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_normal.kill_death_ratio,
            sessionData.solo_normal.kill_death_ratio
          )}**

Heads: **${this.client.util.formatDifference(
            data.solo_normal.heads,
            sessionData.solo_normal.heads
          )}**`,
          inline: true
        },
        {
          name: 'Teams Normal 🧑‍🤝‍🧑',
          value: `Wins: **${this.client.util.formatDifference(
            data.teams_normal.wins,
            sessionData.teams_normal.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.teams_normal.losses,
            sessionData.teams_normal.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.teams_normal.win_loss_ratio,
            sessionData.teams_normal.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.teams_normal.kills,
            sessionData.teams_normal.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.teams_normal.deaths,
            sessionData.teams_normal.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.teams_normal.kill_death_ratio,
            sessionData.teams_normal.kill_death_ratio
          )}**

Heads: **${this.client.util.formatDifference(
            data.teams_normal.heads,
            sessionData.teams_normal.heads
          )}**`,
          inline: true
        },
        {
          name: 'Mega 💥',
          value: `Wins: **${this.client.util.formatDifference(
            data.mega.wins,
            sessionData.mega.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.mega.losses,
            sessionData.mega.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.mega.win_loss_ratio,
            sessionData.mega.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.mega.kills,
            sessionData.mega.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.mega.deaths,
            sessionData.mega.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.mega.kill_death_ratio,
            sessionData.mega.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Insane 🤺',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_insane.wins,
            sessionData.solo_insane.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_insane.losses,
            sessionData.solo_insane.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_insane.win_loss_ratio,
            sessionData.solo_insane.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_insane.kills,
            sessionData.solo_insane.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_insane.deaths,
            sessionData.solo_insane.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_insane.kill_death_ratio,
            sessionData.solo_insane.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Teams Insane 🧑‍🤝‍🧑',
          value: `Wins: **${this.client.util.formatDifference(
            data.teams_insane.wins,
            sessionData.teams_insane.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.teams_insane.losses,
            sessionData.teams_insane.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.teams_insane.win_loss_ratio,
            sessionData.teams_insane.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.teams_insane.kills,
            sessionData.teams_insane.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.teams_insane.deaths,
            sessionData.teams_insane.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.teams_insane.kill_death_ratio,
            sessionData.teams_insane.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Lucky 🍀',
          value: `Wins: **${this.client.util.formatDifference(
            data.lucky.wins,
            sessionData.lucky.wins
          )}**`,
          inline: true
        },
        {
          name: 'Rush ⏩',
          value: `Wins: **${this.client.util.formatDifference(
            data.rush.wins,
            sessionData.rush.wins
          )}**`,
          inline: true
        }
      ]
    });

    return null;
  }
}
