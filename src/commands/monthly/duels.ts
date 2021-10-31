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

    this.description =
      'Retrieves the monthly Duels session statistics of a player';
  }

  public async run(
    { author, channel, id: replyID }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const { id, created_at: started } =
      await this.client.profile.findSessionOfType('monthly', player);
    const session = await this.client.profile.loadSession(id);

    const data = this.client.hutil.formatDuels(player);
    const sessionData = this.client.hutil.formatDuels(session);

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
          )}**

Bow Accuracy: **${this.client.util.formatDifference(
            data.overall.bow_accuracy,
            sessionData.overall.bow_accuracy,
            2,
            true
          )}**`,
          inline: true
        },
        {
          name: 'Solo UHC 🍎',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_uhc.wins,
            sessionData.solo_uhc.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_uhc.losses,
            sessionData.solo_uhc.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_uhc.win_loss_ratio,
            sessionData.solo_uhc.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_uhc.kills,
            sessionData.solo_uhc.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_uhc.deaths,
            sessionData.solo_uhc.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_uhc.kill_death_ratio,
            sessionData.solo_uhc.kill_death_ratio
          )}**

Bow Accuracy: **${this.client.util.formatDifference(
            data.solo_uhc.bow_accuracy,
            sessionData.solo_uhc.bow_accuracy,
            2,
            true
          )}**`,
          inline: true
        },
        {
          name: 'Doubles UHC 🍎',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_uhc.wins,
            sessionData.doubles_uhc.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_uhc.losses,
            sessionData.doubles_uhc.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_uhc.win_loss_ratio,
            sessionData.doubles_uhc.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_uhc.kills,
            sessionData.doubles_uhc.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_uhc.deaths,
            sessionData.doubles_uhc.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_uhc.kill_death_ratio,
            sessionData.doubles_uhc.kill_death_ratio
          )}**

Bow Accuracy: **${this.client.util.formatDifference(
            data.doubles_uhc.bow_accuracy,
            sessionData.doubles_uhc.bow_accuracy,
            2,
            true
          )}**`,
          inline: true
        },
        {
          name: 'Solo SkyWars 🏝️',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_skywars.wins,
            sessionData.solo_skywars.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_skywars.losses,
            sessionData.solo_skywars.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_skywars.win_loss_ratio,
            sessionData.solo_skywars.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_skywars.kills,
            sessionData.solo_skywars.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_skywars.deaths,
            sessionData.solo_skywars.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_skywars.kill_death_ratio,
            sessionData.solo_skywars.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles SkyWars 🏝️',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_skywars.wins,
            sessionData.doubles_skywars.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_skywars.losses,
            sessionData.doubles_skywars.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_skywars.win_loss_ratio,
            sessionData.doubles_skywars.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_skywars.kills,
            sessionData.doubles_skywars.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_skywars.deaths,
            sessionData.doubles_skywars.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_skywars.kill_death_ratio,
            sessionData.doubles_skywars.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Mega Walls 🧱',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_mega_walls.wins,
            sessionData.solo_mega_walls.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_mega_walls.losses,
            sessionData.solo_mega_walls.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_mega_walls.win_loss_ratio,
            sessionData.solo_mega_walls.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_mega_walls.kills,
            sessionData.solo_mega_walls.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_mega_walls.deaths,
            sessionData.solo_mega_walls.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_mega_walls.kill_death_ratio,
            sessionData.solo_mega_walls.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles Mega Walls 🧱',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_mega_walls.wins,
            sessionData.doubles_mega_walls.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_mega_walls.losses,
            sessionData.doubles_mega_walls.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_mega_walls.win_loss_ratio,
            sessionData.doubles_mega_walls.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_mega_walls.kills,
            sessionData.doubles_mega_walls.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_mega_walls.deaths,
            sessionData.doubles_mega_walls.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_mega_walls.kill_death_ratio,
            sessionData.doubles_mega_walls.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Combo ⚔️',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_combo.wins,
            sessionData.solo_combo.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_combo.losses,
            sessionData.solo_combo.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_combo.win_loss_ratio,
            sessionData.solo_combo.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_combo.kills,
            sessionData.solo_combo.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_combo.deaths,
            sessionData.solo_combo.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_combo.kill_death_ratio,
            sessionData.solo_combo.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles Combo ⚔️',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_combo.wins,
            sessionData.doubles_combo.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_combo.losses,
            sessionData.doubles_combo.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_combo.win_loss_ratio,
            sessionData.doubles_combo.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_combo.kills,
            sessionData.doubles_combo.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_combo.deaths,
            sessionData.doubles_combo.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_combo.kill_death_ratio,
            sessionData.doubles_combo.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo NoDebuff 🧪',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_no_debuff.wins,
            sessionData.solo_no_debuff.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_no_debuff.losses,
            sessionData.solo_no_debuff.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_no_debuff.win_loss_ratio,
            sessionData.solo_no_debuff.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_no_debuff.kills,
            sessionData.solo_no_debuff.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_no_debuff.deaths,
            sessionData.solo_no_debuff.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_no_debuff.kill_death_ratio,
            sessionData.solo_no_debuff.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles NoDebuff 🧪',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_no_debuff.wins,
            sessionData.doubles_no_debuff.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_no_debuff.losses,
            sessionData.doubles_no_debuff.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_no_debuff.win_loss_ratio,
            sessionData.doubles_no_debuff.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_no_debuff.kills,
            sessionData.doubles_no_debuff.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_no_debuff.deaths,
            sessionData.doubles_no_debuff.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_no_debuff.kill_death_ratio,
            sessionData.doubles_no_debuff.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Classic 🌴',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_classic.wins,
            sessionData.solo_classic.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_classic.losses,
            sessionData.solo_classic.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_classic.win_loss_ratio,
            sessionData.solo_classic.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_classic.kills,
            sessionData.solo_classic.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_classic.deaths,
            sessionData.solo_classic.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_classic.kill_death_ratio,
            sessionData.solo_classic.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles Classic 🌴',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_classic.wins,
            sessionData.doubles_classic.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_classic.losses,
            sessionData.doubles_classic.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_classic.win_loss_ratio,
            sessionData.doubles_classic.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_classic.kills,
            sessionData.doubles_classic.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_classic.deaths,
            sessionData.doubles_classic.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_classic.kill_death_ratio,
            sessionData.doubles_classic.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Bow 🏹',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_bow.wins,
            sessionData.solo_bow.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_bow.losses,
            sessionData.solo_bow.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_bow.win_loss_ratio,
            sessionData.solo_bow.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_bow.kills,
            sessionData.solo_bow.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_bow.deaths,
            sessionData.solo_bow.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_bow.kill_death_ratio,
            sessionData.solo_bow.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles Bow 🏹',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_bow.wins,
            sessionData.doubles_bow.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_bow.losses,
            sessionData.doubles_bow.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_bow.win_loss_ratio,
            sessionData.doubles_bow.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_bow.kills,
            sessionData.doubles_bow.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_bow.deaths,
            sessionData.doubles_bow.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_bow.kill_death_ratio,
            sessionData.doubles_bow.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo OP 🔮',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_op.wins,
            sessionData.solo_op.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_op.losses,
            sessionData.solo_op.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_op.win_loss_ratio,
            sessionData.solo_op.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_op.kills,
            sessionData.solo_op.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_op.deaths,
            sessionData.solo_op.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_op.kill_death_ratio,
            sessionData.solo_op.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles OP 🔮',
          value: `Wins: **${this.client.util.formatDifference(
            data.doubles_op.wins,
            sessionData.doubles_op.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.doubles_op.losses,
            sessionData.doubles_op.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.doubles_op.win_loss_ratio,
            sessionData.doubles_op.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.doubles_op.kills,
            sessionData.doubles_op.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.doubles_op.deaths,
            sessionData.doubles_op.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.doubles_op.kill_death_ratio,
            sessionData.doubles_op.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo BowSpleef 🏹',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_bowspleef.wins,
            sessionData.solo_bowspleef.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_bowspleef.losses,
            sessionData.solo_bowspleef.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_bowspleef.win_loss_ratio,
            sessionData.solo_bowspleef.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_bowspleef.kills,
            sessionData.solo_bowspleef.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_bowspleef.deaths,
            sessionData.solo_bowspleef.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_bowspleef.kill_death_ratio,
            sessionData.solo_bowspleef.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo Sumo 🤜',
          value: `Wins: **${this.client.util.formatDifference(
            data.solo_sumo.wins,
            sessionData.solo_sumo.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.solo_sumo.losses,
            sessionData.solo_sumo.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.solo_sumo.win_loss_ratio,
            sessionData.solo_sumo.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.solo_sumo.kills,
            sessionData.solo_sumo.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.solo_sumo.deaths,
            sessionData.solo_sumo.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.solo_sumo.kill_death_ratio,
            sessionData.solo_sumo.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'SkyWars Tournament 🏝️',
          value: `Wins: **${this.client.util.formatDifference(
            data.skywars_tournament.wins,
            sessionData.skywars_tournament.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.skywars_tournament.losses,
            sessionData.skywars_tournament.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.skywars_tournament.win_loss_ratio,
            sessionData.skywars_tournament.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.skywars_tournament.kills,
            sessionData.skywars_tournament.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.skywars_tournament.deaths,
            sessionData.skywars_tournament.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.skywars_tournament.kill_death_ratio,
            sessionData.skywars_tournament.kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'OP Tournament 🔮',
          value: `Wins: **${this.client.util.formatDifference(
            data.op_tournament.wins,
            sessionData.op_tournament.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.op_tournament.losses,
            sessionData.op_tournament.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.op_tournament.win_loss_ratio,
            sessionData.op_tournament.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.op_tournament.kills,
            sessionData.op_tournament.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.op_tournament.deaths,
            sessionData.op_tournament.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.op_tournament.kill_death_ratio,
            sessionData.op_tournament.kill_death_ratio
          )}**`,
          inline: true
        }
      ],
      description: `Winstreak: **${this.client.util.formatDifference(
        data.overall.winstreak,
        sessionData.overall.winstreak
      )}**
Best Winstreak: **${this.client.util.formatDifference(
        data.overall.best_winstreak,
        sessionData.overall.best_winstreak
      )}**

Games: **${this.client.util.formatDifference(
        data.overall.games_played,
        sessionData.overall.games_played
      )}**
Melee Accuracy: **${this.client.util.formatDifference(
        data.overall.melee_accuracy,
        sessionData.overall.melee_accuracy,
        2,
        true
      )}**
Blocks Placed: **${this.client.util.formatDifference(
        data.overall.blocks_placed,
        sessionData.overall.blocks_placed
      )}**`,
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Duels-64.png',
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(
          player
        )} ➢ Duels (Monthly)`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      }
    });

    return null;
  }
}
