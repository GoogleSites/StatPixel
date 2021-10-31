import type { TextChannel } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class BedWars extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('bw');
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

    this.description = 'Retrieves the BedWars session statistics of a player';
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

    const data = this.client.hutil.formatBedWars(player);
    const sessionData = this.client.hutil.formatBedWars(session);

    this.client.util.scroller(channel as TextChannel, author, {
      reply: replyID,
      footer: {
        timestamp: started,
        text: 'Session started',
        icon_url: this.client.config.embed.footer.icon_url
      },
      description: `Stars: **${this.client.util.formatDifference(
        data.overall.level,
        sessionData.overall.level
      )}** ⭐`,
      maxFields: 3,
      title: {
        name: `${this.client.hutil.computeDisplayName(player)} ➢ BedWars`,
        icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
      },
      icon: 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png',
      fields: [
        {
          name: 'General 📰',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.overall.winstreak,
            sessionData.overall.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
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

Beds Broken: **${this.client.util.formatDifference(
            data.overall.beds_broken,
            sessionData.overall.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.overall.beds_lost,
            sessionData.overall.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.overall.beds_per_game,
            sessionData.overall.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.overall.final_kills,
            sessionData.overall.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.overall.final_deaths,
            sessionData.overall.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.overall.final_kill_death_ratio,
            sessionData.overall.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo 🤺',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.eight_one.winstreak,
            sessionData.eight_one.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.eight_one.wins,
            sessionData.eight_one.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.eight_one.losses,
            sessionData.eight_one.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.eight_one.win_loss_ratio,
            sessionData.eight_one.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.eight_one.kills,
            sessionData.eight_one.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.eight_one.deaths,
            sessionData.eight_one.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.eight_one.kill_death_ratio,
            sessionData.eight_one.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.eight_one.beds_broken,
            sessionData.eight_one.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.eight_one.beds_lost,
            sessionData.eight_one.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.eight_one.beds_per_game,
            sessionData.eight_one.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.eight_one.final_kills,
            sessionData.eight_one.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.eight_one.final_deaths,
            sessionData.eight_one.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.eight_one.final_kill_death_ratio,
            sessionData.eight_one.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles 👫',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.eight_two.winstreak,
            sessionData.eight_two.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.eight_two.wins,
            sessionData.eight_two.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.eight_two.losses,
            sessionData.eight_two.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.eight_two.win_loss_ratio,
            sessionData.eight_two.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.eight_two.kills,
            sessionData.eight_two.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.eight_two.deaths,
            sessionData.eight_two.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.eight_two.kill_death_ratio,
            sessionData.eight_two.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.eight_two.beds_broken,
            sessionData.eight_two.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.eight_two.beds_lost,
            sessionData.eight_two.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.eight_two.beds_per_game,
            sessionData.eight_two.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.eight_two.final_kills,
            sessionData.eight_two.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.eight_two.final_deaths,
            sessionData.eight_two.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.eight_two.final_kill_death_ratio,
            sessionData.eight_two.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Threes 👨‍👩‍👦',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.four_three.winstreak,
            sessionData.four_three.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
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
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.four_three.beds_broken,
            sessionData.four_three.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.four_three.beds_lost,
            sessionData.four_three.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.four_three.beds_per_game,
            sessionData.four_three.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.four_three.final_kills,
            sessionData.four_three.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.four_three.final_deaths,
            sessionData.four_three.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.four_three.final_kill_death_ratio,
            sessionData.four_three.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Fours 👨‍👩‍👧‍👦',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.four_four.winstreak,
            sessionData.four_four.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.four_four.wins,
            sessionData.four_four.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.four_four.losses,
            sessionData.four_four.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.four_four.win_loss_ratio,
            sessionData.four_four.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.four_four.kills,
            sessionData.four_four.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.four_four.deaths,
            sessionData.four_four.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.four_four.kill_death_ratio,
            sessionData.four_four.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.four_four.beds_broken,
            sessionData.four_four.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.four_four.beds_lost,
            sessionData.four_four.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.four_four.beds_per_game,
            sessionData.four_four.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.four_four.final_kills,
            sessionData.four_four.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.four_four.final_deaths,
            sessionData.four_four.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.four_four.final_kill_death_ratio,
            sessionData.four_four.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: '4v4 👨‍👩‍👧‍👦',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.two_four.winstreak,
            sessionData.two_four.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.two_four.wins,
            sessionData.two_four.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.two_four.losses,
            sessionData.two_four.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.two_four.win_loss_ratio,
            sessionData.two_four.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.two_four.kills,
            sessionData.two_four.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.two_four.deaths,
            sessionData.two_four.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.two_four.kill_death_ratio,
            sessionData.two_four.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.two_four.beds_broken,
            sessionData.two_four.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.two_four.beds_lost,
            sessionData.two_four.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.two_four.beds_per_game,
            sessionData.two_four.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.two_four.final_kills,
            sessionData.two_four.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.two_four.final_deaths,
            sessionData.two_four.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.two_four.final_kill_death_ratio,
            sessionData.two_four.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Armed 🔫',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.armed.winstreak,
            sessionData.armed.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.armed.wins,
            sessionData.armed.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.armed.losses,
            sessionData.armed.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.armed.win_loss_ratio,
            sessionData.armed.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.armed.kills,
            sessionData.armed.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.armed.deaths,
            sessionData.armed.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.armed.kill_death_ratio,
            sessionData.armed.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.armed.beds_broken,
            sessionData.armed.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.armed.beds_lost,
            sessionData.armed.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.armed.beds_per_game,
            sessionData.armed.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.armed.final_kills,
            sessionData.armed.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.armed.final_deaths,
            sessionData.armed.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.armed.final_kill_death_ratio,
            sessionData.armed.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Rush ⏩',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.rush.winstreak,
            sessionData.rush.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.rush.wins,
            sessionData.rush.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.rush.losses,
            sessionData.rush.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.rush.win_loss_ratio,
            sessionData.rush.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.rush.kills,
            sessionData.rush.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.rush.deaths,
            sessionData.rush.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.rush.kill_death_ratio,
            sessionData.rush.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.rush.beds_broken,
            sessionData.rush.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.rush.beds_lost,
            sessionData.rush.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.rush.beds_per_game,
            sessionData.rush.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.rush.final_kills,
            sessionData.rush.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.rush.final_deaths,
            sessionData.rush.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.rush.final_kill_death_ratio,
            sessionData.rush.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Ultimate ⚔️',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.ultimate.winstreak,
            sessionData.ultimate.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.ultimate.wins,
            sessionData.ultimate.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.ultimate.losses,
            sessionData.ultimate.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.ultimate.win_loss_ratio,
            sessionData.ultimate.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.ultimate.kills,
            sessionData.ultimate.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.ultimate.deaths,
            sessionData.ultimate.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.ultimate.kill_death_ratio,
            sessionData.ultimate.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.ultimate.beds_broken,
            sessionData.ultimate.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.ultimate.beds_lost,
            sessionData.ultimate.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.ultimate.beds_per_game,
            sessionData.ultimate.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.ultimate.final_kills,
            sessionData.ultimate.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.ultimate.final_deaths,
            sessionData.ultimate.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.ultimate.final_kill_death_ratio,
            sessionData.ultimate.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Castle 🏰',
          value: `Winstreak: **${this.client.util.formatDifference(
            data.castle.winstreak,
            sessionData.castle.winstreak
          )}**

Wins: **${this.client.util.formatDifference(
            data.castle.wins,
            sessionData.castle.wins
          )}**
Losses: **${this.client.util.formatDifference(
            data.castle.losses,
            sessionData.castle.losses
          )}**
W/L: **${this.client.util.formatDifference(
            data.castle.win_loss_ratio,
            sessionData.castle.win_loss_ratio
          )}**

Kills: **${this.client.util.formatDifference(
            data.castle.kills,
            sessionData.castle.kills
          )}**
Deaths: **${this.client.util.formatDifference(
            data.castle.deaths,
            sessionData.castle.deaths
          )}**
K/D: **${this.client.util.formatDifference(
            data.castle.kill_death_ratio,
            sessionData.castle.kill_death_ratio
          )}**

Beds Broken: **${this.client.util.formatDifference(
            data.castle.beds_broken,
            sessionData.castle.beds_broken
          )}**
Beds Lost: **${this.client.util.formatDifference(
            data.castle.beds_lost,
            sessionData.castle.beds_lost
          )}**
B/G: **${this.client.util.formatDifference(
            data.castle.beds_per_game,
            sessionData.castle.beds_per_game
          )}**

F. Kills: **${this.client.util.formatDifference(
            data.castle.final_kills,
            sessionData.castle.final_kills
          )}**
F. Deaths: **${this.client.util.formatDifference(
            data.castle.final_deaths,
            sessionData.castle.final_deaths
          )}**
F. K/D: **${this.client.util.formatDifference(
            data.castle.final_kill_death_ratio,
            sessionData.castle.final_kill_death_ratio
          )}**`,
          inline: true
        }
      ]
    });

    return null;
  }
}
