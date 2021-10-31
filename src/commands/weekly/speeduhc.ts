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

    this.description =
      'Retrieves the weekly SpeedUHC session statistics of a player';
  }

  public async run(
    { author, channel, id: replyID }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } =
      await this.client.profile.findSessionOfType('weekly', player);
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatSpeedUHC(player);
    const sessionData = this.client.hutil.formatSpeedUHC(session);

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
          name: 'Solo Normal 🤺',
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
          name: 'Teams Normal 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.team.wins,
            sessionData.team.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.team.losses,
            sessionData.team.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.team.win_loss_ratio,
            sessionData.team.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.team.kills,
            sessionData.team.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.team.deaths,
            sessionData.team.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.team.kill_death_ratio,
            sessionData.team.kill_death_ratio
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
          name: 'Teams Insane 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.team_insane.wins,
            sessionData.team_insane.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.team_insane.losses,
            sessionData.team_insane.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.team_insane.win_loss_ratio,
            sessionData.team_insane.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.team_insane.kills,
            sessionData.team_insane.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.team_insane.deaths,
            sessionData.team_insane.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.team_insane.kill_death_ratio,
            sessionData.team_insane.kill_death_ratio
          )}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/UHC-64.png',
      description: `Salt: **${this.client.util.formatDifference(
        data.overall.salt,
        sessionData.overall.salt
      )}** 🧂`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(
          player
        )} ➢ Speed UHC (Weekly)`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
