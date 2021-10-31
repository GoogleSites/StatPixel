import type { TextChannel } from 'discord.js-light';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

// Elo: **40,000** [ℹ️ What's this?](https://discord.gg/rbw "This is your rating for Ranked Bedwars. If you want to try it out, join discord.gg/rbw or click the emoji.")

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

    this.description = 'Retrieves the BedWars statistics of a player';
  }

  public async run(
    { author, channel, id }: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatBedWars(player);

    this.client.util.scroller(channel as TextChannel, author, {
      reply: id,
      description: `Stars: **${this.client.util.formatNumber(
        data.overall.level
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
          value: `Winstreak: **${this.client.util.formatNumber(
            data.overall.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.overall.wins)}**
Losses: **${this.client.util.formatNumber(data.overall.losses)}**
W/L: **${this.client.util.formatNumber(data.overall.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.overall.kills)}**
Deaths: **${this.client.util.formatNumber(data.overall.deaths)}**
K/D: **${this.client.util.formatNumber(data.overall.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.overall.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.overall.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.overall.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.overall.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.overall.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.overall.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Solo 🤺',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.eight_one.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.eight_one.wins)}**
Losses: **${this.client.util.formatNumber(data.eight_one.losses)}**
W/L: **${this.client.util.formatNumber(data.eight_one.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.eight_one.kills)}**
Deaths: **${this.client.util.formatNumber(data.eight_one.deaths)}**
K/D: **${this.client.util.formatNumber(data.eight_one.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.eight_one.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.eight_one.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.eight_one.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.eight_one.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.eight_one.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.eight_one.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Doubles 👫',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.eight_two.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.eight_two.wins)}**
Losses: **${this.client.util.formatNumber(data.eight_two.losses)}**
W/L: **${this.client.util.formatNumber(data.eight_two.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.eight_two.kills)}**
Deaths: **${this.client.util.formatNumber(data.eight_two.deaths)}**
K/D: **${this.client.util.formatNumber(data.eight_two.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.eight_two.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.eight_two.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.eight_two.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.eight_two.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.eight_two.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.eight_two.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Threes 👨‍👩‍👦',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.four_three.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.four_three.wins)}**
Losses: **${this.client.util.formatNumber(data.four_three.losses)}**
W/L: **${this.client.util.formatNumber(data.four_three.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.four_three.kills)}**
Deaths: **${this.client.util.formatNumber(data.four_three.deaths)}**
K/D: **${this.client.util.formatNumber(data.four_three.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.four_three.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.four_three.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.four_three.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.four_three.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.four_three.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.four_three.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Fours 👨‍👩‍👧‍👦',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.four_four.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.four_four.wins)}**
Losses: **${this.client.util.formatNumber(data.four_four.losses)}**
W/L: **${this.client.util.formatNumber(data.four_four.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.four_four.kills)}**
Deaths: **${this.client.util.formatNumber(data.four_four.deaths)}**
K/D: **${this.client.util.formatNumber(data.four_four.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.four_four.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.four_four.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.four_four.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.four_four.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.four_four.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.four_four.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: '4v4 👨‍👩‍👧‍👦',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.two_four.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.two_four.wins)}**
Losses: **${this.client.util.formatNumber(data.two_four.losses)}**
W/L: **${this.client.util.formatNumber(data.two_four.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.two_four.kills)}**
Deaths: **${this.client.util.formatNumber(data.two_four.deaths)}**
K/D: **${this.client.util.formatNumber(data.two_four.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.two_four.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.two_four.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.two_four.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.two_four.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.two_four.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.two_four.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Armed 🔫',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.armed.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.armed.wins)}**
Losses: **${this.client.util.formatNumber(data.armed.losses)}**
W/L: **${this.client.util.formatNumber(data.armed.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.armed.kills)}**
Deaths: **${this.client.util.formatNumber(data.armed.deaths)}**
K/D: **${this.client.util.formatNumber(data.armed.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.armed.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.armed.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.armed.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.armed.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.armed.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.armed.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Rush ⏩',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.rush.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.rush.wins)}**
Losses: **${this.client.util.formatNumber(data.rush.losses)}**
W/L: **${this.client.util.formatNumber(data.rush.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.rush.kills)}**
Deaths: **${this.client.util.formatNumber(data.rush.deaths)}**
K/D: **${this.client.util.formatNumber(data.rush.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.rush.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.rush.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.rush.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.rush.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.rush.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(data.rush.final_kill_death_ratio)}**`,
          inline: true
        },
        {
          name: 'Ultimate ⚔️',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.ultimate.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.ultimate.wins)}**
Losses: **${this.client.util.formatNumber(data.ultimate.losses)}**
W/L: **${this.client.util.formatNumber(data.ultimate.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.ultimate.kills)}**
Deaths: **${this.client.util.formatNumber(data.ultimate.deaths)}**
K/D: **${this.client.util.formatNumber(data.ultimate.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.ultimate.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.ultimate.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.ultimate.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.ultimate.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.ultimate.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.ultimate.final_kill_death_ratio
          )}**`,
          inline: true
        },
        {
          name: 'Castle 🏰',
          value: `Winstreak: **${this.client.util.formatNumber(
            data.castle.winstreak
          )}**

Wins: **${this.client.util.formatNumber(data.castle.wins)}**
Losses: **${this.client.util.formatNumber(data.castle.losses)}**
W/L: **${this.client.util.formatNumber(data.castle.win_loss_ratio)}**

Kills: **${this.client.util.formatNumber(data.castle.kills)}**
Deaths: **${this.client.util.formatNumber(data.castle.deaths)}**
K/D: **${this.client.util.formatNumber(data.castle.kill_death_ratio)}**

Beds Broken: **${this.client.util.formatNumber(data.castle.beds_broken)}**
Beds Lost: **${this.client.util.formatNumber(data.castle.beds_lost)}**
B/G: **${this.client.util.formatNumber(data.castle.beds_per_game)}**

F. Kills: **${this.client.util.formatNumber(data.castle.final_kills)}**
F. Deaths: **${this.client.util.formatNumber(data.castle.final_deaths)}**
F. K/D: **${this.client.util.formatNumber(
            data.castle.final_kill_death_ratio
          )}**`,
          inline: true
        }
      ]
    });

    return null;
  }
}
