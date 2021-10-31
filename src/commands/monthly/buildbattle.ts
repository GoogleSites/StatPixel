import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class BuildBattle extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('bb');
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
      'Retrieves the monthly Build Battle session statistics of a player';
  }

  public async run(
    _: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } =
      await this.client.profile.findSessionOfType('monthly', player);
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatBuildBattle(player);
    const sessionData = this.client.hutil.formatBuildBattle(session);

    const prefix = await this.client.hutil.computeBuildBattlePrefix(player);

    return {
      embed: {
        footer: {
          text: 'Session started',
          icon_url: this.client.config.embed.footer.icon_url
        },
        timestamp: started,
        thumbnail: {
          url: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BuildBattle-64.png'
        },
        author: {
          name: `${this.client.hutil.computeDisplayName(
            player
          )} ➢ Build Battle (Monthly)`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        fields: [
          {
            name: 'General 📰',
            value: `Coins: **${this.client.util.formatDifference(
              data.overall.coins,
              sessionData.overall.coins
            )}** 🪙
Score: **${this.client.util.formatDifference(
              data.overall.score,
              sessionData.overall.score
            )}**
Rank: \`${prefix}\`
Games: **${this.client.util.formatDifference(
              data.overall.games_played,
              sessionData.overall.games_played
            )}**
Wins: **${this.client.util.formatDifference(
              data.overall.wins,
              sessionData.overall.wins
            )}**
Votes: **${this.client.util.formatDifference(
              data.overall.votes,
              sessionData.overall.votes
            )}**
Win Rate: **${this.client.util.formatDifference(
              data.overall.win_rate,
              sessionData.overall.win_rate,
              0,
              true
            )}**`,
            inline: true
          },
          {
            name: 'Solo 🤺',
            value: `Wins: **${this.client.util.formatDifference(
              data.solo_normal.wins,
              sessionData.solo_normal.wins
            )}**
            
**Teams** 👫
Wins: **${this.client.util.formatDifference(
              data.teams_normal.wins,
              sessionData.teams_normal.wins
            )}**

**Pro** 🤖
Wins: **${this.client.util.formatDifference(
              data.pro.wins,
              sessionData.pro.wins
            )}**`,
            inline: true
          },
          {
            name: 'Guess the Build 🗯️',
            value: `Wins: **${this.client.util.formatDifference(
              data.guess.wins,
              sessionData.guess.wins
            )}**
Correct Guesses: **${this.client.util.formatDifference(
              data.guess.correct_guesses,
              sessionData.guess.correct_guesses
            )}**`,
            inline: true
          }
        ]
      }
    };
  }
}
