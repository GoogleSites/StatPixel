import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class Bridge extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('bridgeduel', 'bridges');
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

    this.description = 'Retrieves the Bridge session statistics of a player';
  }

  public async run(
    { author, channel, id: replyID }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } = await this.client.profile.findSession(
      player,
      author.id
    );
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatBridge(player);
    const sessionData = this.client.hutil.formatBridge(session);

    this.client.util.scroller(channel, author, {
      reply: replyID,
      footer: {
        timestamp: started,
        text: 'Session started',
        icon_url: this.client.config.embed.footer.icon_url
      },
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
          )}**`,
          inline: true
        },
        {
          name: 'Solo 🤺',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo.wins,
            sessionData.solo.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo.losses,
            sessionData.solo.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo.win_loss_ratio,
            sessionData.solo.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo.kills,
            sessionData.solo.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo.deaths,
            sessionData.solo.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo.kill_death_ratio,
            sessionData.solo.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles.wins,
            sessionData.doubles.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles.losses,
            sessionData.doubles.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles.win_loss_ratio,
            sessionData.doubles.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles.kills,
            sessionData.doubles.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles.deaths,
            sessionData.doubles.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles.kill_death_ratio,
            sessionData.doubles.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: '2v2v2v2 🤺',
          value: `Wins: **${this.client.util.formatDifference(
            data.four_two.wins,
            sessionData.four_two.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.four_two.losses,
            sessionData.four_two.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.four_two.win_loss_ratio,
            sessionData.four_two.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.four_two.kills,
            sessionData.four_two.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.four_two.deaths,
            sessionData.four_two.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.four_two.kill_death_ratio,
            sessionData.four_two.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: '3v3v3v3 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.four_three.wins,
            sessionData.four_three.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.four_three.losses,
            sessionData.four_three.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.four_three.win_loss_ratio,
            sessionData.four_three.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.four_three.kills,
            sessionData.four_three.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.four_three.deaths,
            sessionData.four_three.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.four_three.kill_death_ratio,
            sessionData.four_three.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Fours 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.fours.wins,
            sessionData.fours.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.fours.losses,
            sessionData.fours.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.fours.win_loss_ratio,
            sessionData.fours.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.fours.kills,
            sessionData.fours.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.fours.deaths,
            sessionData.fours.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.fours.kill_death_ratio,
            sessionData.fours.kill_death_ratio
          )}**`,
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
