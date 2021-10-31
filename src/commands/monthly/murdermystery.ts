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

    this.description =
      'Retrieves the monthly Murder Mystery session statistics of a player';
  }

  public async run(
    { author, channel, id: replyID }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } =
      await this.client.profile.findSessionOfType('monthly', player);
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatMurderMystery(player);
    const sessionData = this.client.hutil.formatMurderMystery(session);

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
Games: **${this.client.util.formatDifference(
            data.overall.games,
            sessionData.overall.games
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

Gold: **${this.client.util.formatDifference(
            data.overall.gold,
            sessionData.overall.gold
          )}**`,
          inline: true
        },
        {
          name: 'Classic 🌴',
          value: `Wins: **${this.client.util.formatDifference(
            data.classic.wins,
            sessionData.classic.wins
          )}**
Games: **${this.client.util.formatDifference(
            data.classic.games,
            sessionData.classic.games
          )}**

Kills: **${this.client.util.formatDifference(
            data.classic.kills,
            sessionData.classic.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.classic.deaths,
            sessionData.classic.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.classic.kill_death_ratio,
            sessionData.classic.kill_death_ratio
          )}**

Gold: **${this.client.util.formatDifference(
            data.classic.gold,
            sessionData.classic.gold
          )}**`,
          inline: true
        },
        {
          name: 'Double Up 👫',
          value: `Wins: **${this.client.util.formatDifference(
            data.double_up.wins,
            sessionData.double_up.wins
          )}**
Games: **${this.client.util.formatDifference(
            data.double_up.games,
            sessionData.double_up.games
          )}**

Kills: **${this.client.util.formatDifference(
            data.double_up.kills,
            sessionData.double_up.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.double_up.deaths,
            sessionData.double_up.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.double_up.kill_death_ratio,
            sessionData.double_up.kill_death_ratio
          )}**

Gold: **${this.client.util.formatDifference(
            data.double_up.gold,
            sessionData.double_up.gold
          )}**`,
          inline: true
        },
        {
          name: 'Assassins 🥷',
          value: `Wins: **${this.client.util.formatDifference(
            data.assassins.wins,
            sessionData.assassins.wins
          )}**
Games: **${this.client.util.formatDifference(
            data.assassins.games,
            sessionData.assassins.games
          )}**

Kills: **${this.client.util.formatDifference(
            data.assassins.kills,
            sessionData.assassins.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.assassins.deaths,
            sessionData.assassins.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.assassins.kill_death_ratio,
            sessionData.assassins.kill_death_ratio
          )}**

Gold: **${this.client.util.formatDifference(
            data.assassins.gold,
            sessionData.assassins.gold
          )}**`,
          inline: true
        },
        {
          name: 'Showdown 🔫',
          value: `Wins: **${this.client.util.formatDifference(
            data.showdown.wins,
            sessionData.showdown.wins
          )}**
Games: **${this.client.util.formatDifference(
            data.showdown.games,
            sessionData.showdown.games
          )}**

Kills: **${this.client.util.formatDifference(
            data.showdown.kills,
            sessionData.showdown.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.showdown.deaths,
            sessionData.showdown.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.showdown.kill_death_ratio,
            sessionData.showdown.kill_death_ratio
          )}**

Gold: **${this.client.util.formatDifference(
            data.showdown.gold,
            sessionData.showdown.gold
          )}**`,
          inline: true
        },
        {
          name: 'Infection 🧪',
          value: `Wins: **${this.client.util.formatDifference(
            data.infection.wins,
            sessionData.infection.wins
          )}**
Games: **${this.client.util.formatDifference(
            data.infection.games,
            sessionData.infection.games
          )}**

Kills: **${this.client.util.formatDifference(
            data.infection.kills,
            sessionData.infection.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.infection.deaths,
            sessionData.infection.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.infection.kill_death_ratio,
            sessionData.infection.kill_death_ratio
          )}**

Gold: **${this.client.util.formatDifference(
            data.infection.gold,
            sessionData.infection.gold
          )}**`,
          inline: true
        }
      ],
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/MurderMystery-64.png',
      description: `Coins: **${this.client.util.formatDifference(
        data.overall.coins,
        sessionData.overall.coins
      )}** 🪙`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(
          player
        )} ➢ Murder Mystery (Monthly)`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
