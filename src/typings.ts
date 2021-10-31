import type {
  CommandInteraction,
  DMChannel,
  User as DiscordUser,
  Guild,
  GuildMember,
  MessageEmbedOptions,
  MessageResolvable,
  NewsChannel,
  PartialDMChannel,
  TextChannel
} from 'discord.js-light';
import type { ObjectId } from 'mongodb';

export type Message = {
  _settings: Settings;
  member?: GuildMember | null;
  author: DiscordUser;
  channel:
    | TextChannel
    | NewsChannel
    | DMChannel
    | PartialDMChannel
    | CommandInteraction;
  guild: Guild | null;
  content: string;
  id?: `${bigint}`;
};

export interface UserHistory {
  _id: ObjectId;
  period: number;
  uuid: string;
  data: {
    [key: string]: [number, number][];
  };
}

export interface UserCommandUsageEntry {
  discord_id: string;
  uses: number;
}

export interface CommandUsageEntry {
  key: string;
  uses: number;
}

export type Embed = MessageEmbedOptions;

export interface Settings {
  prefix: string;
  text: boolean;
  colour: string;
  chart: boolean;
}

export interface MessageOptions {
  message?: string;
  embed?: Embed;
  addFieldSpacer?: boolean;
  addDescriptionSpacer?: boolean;
  files?: {
    attachment: Buffer | string;
    name: string;
  }[];
  reply?: MessageResolvable;
}

export interface User {
  _id: ObjectId;
  discord_id: string;
  uuid?: string;
  sessions: Session[];
  active_session: number;
  verified?: boolean;
  banned_until?: number | null;
  daily?: {
    id: ObjectId;
    time: number;
  };
  weekly?: {
    id: ObjectId;
    time: number;
  };
  monthly?: {
    id: ObjectId;
    time: number;
  };
}

export interface StoredGuild {
  _id: ObjectId;
  id: string;
  checked_at: number;
  experience: number;
  game_experience: { [key: string]: number };
  members: {
    uuid: string;
    quests: number;
    joined_at: number;
  }[];
  name: string;
  name_lower: string;
  total_coins: number;
  icon?: string;
}

export interface Session {
  id: ObjectId;
  created_at: number;
}

export interface BridgeData {
  overall: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  solo: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  doubles: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  four_two: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  four_three: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  fours: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
}

export interface BuildBattleData {
  overall: {
    score: number;
    coins: number;
    games_played: number;
    wins: number;
    votes: number;
    win_rate: number;
  };
  guess: {
    wins: number;
    correct_guesses: number;
  };
  solo_normal: {
    wins: number;
  };
  teams_normal: {
    wins: number;
  };
  pro: {
    wins: number;
  };
}

export interface DuelsData {
  overall: {
    wins: number;
    losses: number;
    best_winstreak: number;
    winstreak: number;
    blocks_placed: number;
    melee_accuracy: number;
    bow_accuracy: number;
    kills: number;
    deaths: number;
    games_played: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_uhc: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    bow_accuracy: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_uhc: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    bow_accuracy: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_skywars: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_skywars: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_mega_walls: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_mega_walls: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_combo: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_combo: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_no_debuff: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_no_debuff: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_classic: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_classic: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_bow: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_bow: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_op: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  doubles_op: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_bowspleef: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  solo_sumo: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  skywars_tournament: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
  op_tournament: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
  };
}

export interface MurderMysteryData {
  overall: {
    coins: number;
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    gold: number;
    kill_death_ratio: number;
  };
  classic: {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    gold: number;
    kill_death_ratio: number;
  };
  double_up: {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    gold: number;
    kill_death_ratio: number;
  };
  assassins: {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    gold: number;
    kill_death_ratio: number;
  };
  showdown: {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    gold: number;
    kill_death_ratio: number;
  };
  infection: {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    gold: number;
    kill_death_ratio: number;
  };
}

export interface UHCData {
  overall: {
    coins: number;
    score: number;
    wins: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
  };
  solo: {
    wins: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
  };
  team: {
    wins: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
  };
  three_team: {
    wins: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
  };
  solo_brawl: {
    wins: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
  };
}

export interface SpeedUHCData {
  overall: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    coins: number;
    salt: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  solo: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  team: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  solo_insane: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
  team_insane: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
  };
}

export interface BedWarsData {
  overall: {
    coins: number;
    level: number;
    experience: number;
    beds_broken: number;
    beds_lost: number;
    winstreak: number;
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  eight_one: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  eight_two: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  four_three: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  four_four: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  two_four: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  armed: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  ultimate: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  rush: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
  castle: {
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    winstreak: number;
    beds_broken: number;
    beds_lost: number;
    final_kills: number;
    final_deaths: number;
    beds_per_game: number;
    beds_broken_per_loss: number;
    win_loss_ratio: number;
    kill_death_ratio: number;
    final_kill_death_ratio: number;
    final_kills_per_game: number;
    clutch_rate: number;
  };
}

export interface SkyWarsData {
  overall: {
    level: number;
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    heads: number;
    blocks_placed: number;
    blocks_broken: number;
    prefix: string;
    coins: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
    experience: number;
    winstreak: number;
  };
  solo_normal: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
    winstreak: number;
  };
  teams_normal: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    heads: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
    winstreak: number;
  };
  mega: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    fastest_win: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
    winstreak: number;
  };
  solo_insane: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
    winstreak: number;
  };
  teams_insane: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    kill_death_ratio: number;
    win_loss_ratio: number;
    winstreak: number;
  };
  lucky: {
    wins: number;
  };
  rush: {
    wins: number;
  };
}
