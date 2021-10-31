import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class Duels extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('duel');
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

    this.description = 'Retrieves the Duels statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatDuels(player);

    this.client.util.scroller(channel, author, {
      reply: id,
      fields: [
        {
          name: 'General 📰',
          value: `Wins: **${this.client.util.formatNumber(data.overall.wins)}**
Losses: **${this.client.util.formatNumber(data.overall.losses)}**
W/L: **${this.client.util.formatNumber(data.overall.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.overall.kills)}**
Deaths: **${this.client.util.formatNumber(data.overall.deaths)}**
K/D: **${this.client.util.formatNumber(data.overall.kill_death_ratio)}**

Bow Accuracy: **${this.client.util.formatNumber(data.overall.bow_accuracy)}%**`,
          inline: true
        },
        {
          name: 'Solo UHC 🍎',
          value: `Wins: **${this.client.util.formatNumber(data.solo_uhc.wins)}**
Losses: **${this.client.util.formatNumber(data.solo_uhc.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_uhc.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_uhc.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_uhc.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_uhc.kill_death_ratio)}**

Bow Accuracy: **${this.client.util.formatNumber(
            data.solo_uhc.bow_accuracy
          )}%**`,
          inline: true
        },
        {
          name: 'Doubles UHC 🍎',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_uhc.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_uhc.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_uhc.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_uhc.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_uhc.deaths)}**
K/D: **${this.client.util.formatNumber(data.doubles_uhc.kill_death_ratio)}**

Bow Accuracy: **${this.client.util.formatNumber(
            data.doubles_uhc.bow_accuracy
          )}%**`,
          inline: true
        },
        {
          name: 'Solo SkyWars 🏝️',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_skywars.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_skywars.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_skywars.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_skywars.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_skywars.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_skywars.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Doubles SkyWars 🏝️',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_skywars.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_skywars.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_skywars.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_skywars.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_skywars.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.doubles_skywars.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Mega Walls 🧱',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_mega_walls.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_mega_walls.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_mega_walls.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_mega_walls.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_mega_walls.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.solo_mega_walls.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles Mega Walls 🧱',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_mega_walls.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_mega_walls.losses)}**
W/L: **${this.client.util.formatNumber(
            data.doubles_mega_walls.win_loss_ratio
          )}**

Kills: **${this.client.util.formatNumber(data.doubles_mega_walls.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_mega_walls.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.doubles_mega_walls.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Combo ⚔️',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_combo.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_combo.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_combo.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_combo.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_combo.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_combo.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Doubles Combo ⚔️',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_combo.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_combo.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_combo.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_combo.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_combo.deaths)}**
K/D: **${this.client.util.formatNumber(data.doubles_combo.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Solo NoDebuff 🧪',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_no_debuff.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_no_debuff.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_no_debuff.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_no_debuff.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_no_debuff.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.solo_no_debuff.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles NoDebuff 🧪',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_no_debuff.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_no_debuff.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_no_debuff.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_no_debuff.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_no_debuff.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.doubles_no_debuff.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Classic 🌴',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_classic.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_classic.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_classic.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_classic.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_classic.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_classic.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Doubles Classic 🌴',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_classic.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_classic.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_classic.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_classic.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_classic.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.doubles_classic.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Bow 🏹',
          value: `Wins: **${this.client.util.formatNumber(data.solo_bow.wins)}**
Losses: **${this.client.util.formatNumber(data.solo_bow.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_bow.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_bow.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_bow.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_bow.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Doubles Bow 🏹',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_bow.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_bow.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_bow.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_bow.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_bow.deaths)}**
K/D: **${this.client.util.formatNumber(data.doubles_bow.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Solo OP 🔮',
          value: `Wins: **${this.client.util.formatNumber(data.solo_op.wins)}**
Losses: **${this.client.util.formatNumber(data.solo_op.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_op.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_op.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_op.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_op.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Doubles OP 🔮',
          value: `Wins: **${this.client.util.formatNumber(
            data.doubles_op.wins
          )}**
Losses: **${this.client.util.formatNumber(data.doubles_op.losses)}**
W/L: **${this.client.util.formatNumber(data.doubles_op.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.doubles_op.kills)}**
Deaths: **${this.client.util.formatNumber(data.doubles_op.deaths)}**
K/D: **${this.client.util.formatNumber(data.doubles_op.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Solo BowSpleef 🏹',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_bowspleef.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_bowspleef.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_bowspleef.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_bowspleef.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_bowspleef.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.solo_bowspleef.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Sumo 🤜',
          value: `Wins: **${this.client.util.formatNumber(
            data.solo_sumo.wins
          )}**
Losses: **${this.client.util.formatNumber(data.solo_sumo.losses)}**
W/L: **${this.client.util.formatNumber(data.solo_sumo.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.solo_sumo.kills)}**
Deaths: **${this.client.util.formatNumber(data.solo_sumo.deaths)}**
K/D: **${this.client.util.formatNumber(data.solo_sumo.kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'SkyWars Tournament 🏝️',
          value: `Wins: **${this.client.util.formatNumber(
            data.skywars_tournament.wins
          )}**
Losses: **${this.client.util.formatNumber(data.skywars_tournament.losses)}**
W/L: **${this.client.util.formatNumber(
            data.skywars_tournament.win_loss_ratio
          )}**

Kills: **${this.client.util.formatNumber(data.skywars_tournament.kills)}**
Deaths: **${this.client.util.formatNumber(data.skywars_tournament.deaths)}**
K/D: **${this.client.util.formatNumber(
            data.skywars_tournament.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'OP Tournament 🔮',
          value: `Wins: **${this.client.util.formatNumber(
            data.op_tournament.wins
          )}**
Losses: **${this.client.util.formatNumber(data.op_tournament.losses)}**
W/L: **${this.client.util.formatNumber(data.op_tournament.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.op_tournament.kills)}**
Deaths: **${this.client.util.formatNumber(data.op_tournament.deaths)}**
K/D: **${this.client.util.formatNumber(data.op_tournament.kill_death_ratio)}**`,
          inline: true
        }
      ],
      description: `Winstreak: **${this.client.util.formatNumber(
        data.overall.winstreak
      )}**
Best Winstreak: **${this.client.util.formatNumber(
        data.overall.best_winstreak
      )}**

Games: **${this.client.util.formatNumber(data.overall.games_played)}**
Melee Accuracy: **${this.client.util.formatNumber(
        data.overall.melee_accuracy
      )}%**
Blocks Placed: **${this.client.util.formatNumber(
        data.overall.blocks_placed
      )}**`,
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png',
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ Duels`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
