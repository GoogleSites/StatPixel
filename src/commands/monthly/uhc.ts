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

    this.description =
      'Retrieves the monthly UHC session statistics of a player';
  }

  public async run(
    { author, channel, id: replyID }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } =
      await this.client.profile.findSessionOfType('monthly', player);
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatUHC(player);
    const sessionData = this.client.hutil.formatUHC(session);

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
          name: 'Solo 🤺',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo.wins,
            sessionData.solo.wins
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
          )}**

Heads: **${this.client.util.formatDifference(
            data.solo.heads,
            sessionData.solo.heads
          )}**`,
          inline: true
        },
        {
          name: 'Teams 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.team.wins,
            sessionData.team.wins
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
          )}**

Heads: **${this.client.util.formatDifference(
            data.team.heads,
            sessionData.team.heads
          )}**`,
          inline: true
        },
        {
          name: 'Teams of 3 👨‍👩‍👦',
          value: `Wins: **${this.client.util.formatDifference(
            data.three_team.wins,
            sessionData.three_team.wins
          )}**

Kills: **${this.client.util.formatDifference(
            data.three_team.kills,
            sessionData.three_team.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.three_team.deaths,
            sessionData.three_team.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.three_team.kill_death_ratio,
            sessionData.three_team.kill_death_ratio
          )}**

Heads: **${this.client.util.formatDifference(
            data.three_team.heads,
            sessionData.three_team.heads
          )}**`,
          inline: true
        },
        {
          name: 'Solo Brawl 💥',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_brawl.wins,
            sessionData.solo_brawl.wins
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_brawl.kills,
            sessionData.solo_brawl.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_brawl.deaths,
            sessionData.solo_brawl.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_brawl.kill_death_ratio,
            sessionData.solo_brawl.kill_death_ratio
          )}**

Heads: **${this.client.util.formatDifference(
            data.solo_brawl.heads,
            sessionData.solo_brawl.heads
          )}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/UHC-64.png',
      description: `Coins: **${this.client.util.formatDifference(
        data.overall.coins,
        sessionData.overall.coins
      )}** 🪙
Score: **${this.client.util.formatDifference(
        data.overall.score,
        sessionData.overall.score
      )}** 🌟`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ UHC (Monthly)`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
