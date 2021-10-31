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

    this.description = 'Retrieves the Build Battle statistics of a player';
  }

  public async run(
    _: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatBuildBattle(player);
    const prefix = await this.client.hutil.computeBuildBattlePrefix(player);

    return {
      embed: {
        thumbnail: {
          url: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BuildBattle-64.png'
        },
        author: {
          name: `${this.client.hutil.computeDisplayName(
            player
          )} ➢ Build Battle`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        fields: [
          {
            name: 'General 📰',
            value: `Coins: **${this.client.util.formatNumber(
              data.overall.coins
            )}** 🪙
Score: **${this.client.util.formatNumber(data.overall.score)}**
Rank: \`${prefix}\`
Games: **${this.client.util.formatNumber(data.overall.games_played)}**
Wins: **${this.client.util.formatNumber(data.overall.wins)}**
Votes: **${this.client.util.formatNumber(data.overall.votes)}**
Win Rate: **${this.client.util.formatNumber(
              Math.round(data.overall.win_rate)
            )}%**`,
            inline: true
          },
          {
            name: 'Solo 🤺',
            value: `Wins: **${this.client.util.formatNumber(
              data.solo_normal.wins
            )}**
            
**Teams** 👫
Wins: **${this.client.util.formatNumber(data.teams_normal.wins)}**

**Pro** 🤖
Wins: **${this.client.util.formatNumber(data.pro.wins)}**`,
            inline: true
          },
          {
            name: 'Guess the Build 🗯️',
            value: `Wins: **${this.client.util.formatNumber(data.guess.wins)}**
Correct Guesses: **${this.client.util.formatNumber(
              data.guess.correct_guesses
            )}**`,
            inline: true
          }
        ]
      }
    };
  }
}
