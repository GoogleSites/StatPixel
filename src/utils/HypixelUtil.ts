import type { Guild, Player } from 'hypixel-api-v2';

import type Main from '../classes/Main';
import type {
  BedWarsData,
  BridgeData,
  BuildBattleData,
  DuelsData,
  MurderMysteryData,
  SkyWarsData,
  SpeedUHCData,
  UHCData
} from '../typings';

export const ROMAN_NUMERALS = [
  'I', 'II', 'III', 'IV', 'V',
  'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV'
];

export const DUELS_TITLE_WINS: {
  overall: {
    [key: string]: number[];
  };
  specific: {
    [key: string]: number[];
  };
} = {
  overall: {
    rookie: [ 100, 120, 140, 160, 180 ],
    iron: [ 200, 260, 320, 380, 440 ],
    gold: [ 500, 600, 700, 800, 900 ],
    diamond: [ 1000, 1200, 1400, 1600, 1800 ],
    master: [ 2000, 2400, 2800, 3200, 3600 ],
    legend: [ 4000, 5200, 6400, 7600, 8800 ],
    grandmaster: [ 10000, 12000, 14000, 16000, 18000 ],
    godlike: [ 20000, 24000, 28000, 32000, 36000, 40000, 44000, 48000, 52000, 56000 ]
  },
  specific: {}
};

for (const key in DUELS_TITLE_WINS.overall) {
  DUELS_TITLE_WINS.specific[key] = DUELS_TITLE_WINS.overall[key].map(n => n / 2);
}

export const DUELS_GAME_FORMAT: {
  [key: string]: string
} = {
  uhc: 'UHC',
  sw: 'SkyWars',
  mw: 'Mega Walls',
  blitz: 'Blitz',
  op: 'OP',
  classic: 'Classic',
  bow: 'Bow',
  nodebuff: 'Nodebuff',
  combo: 'Combo',
  tnt: 'TNT',
  sumo: 'Sumo',
  bridge: 'The Bridge'
};

export const DUELS_TITLE_COLOUR: {
  [key: string]: string
} = {
  rookie: '§8',
  iron: '§f',
  gold: '§6',
  diamond: '§3',
  master: '§2',
  legend: '§4',
  grandmaster: '§e',
  godlike: '§5'
};

export const DUELS_TITLE_FORMAT: {
  [key: string]: string
} = {
  rookie: 'Rookie',
  iron: 'Iron',
  gold: 'Gold',
  diamond: 'Diamond',
  master: 'Master',
  legend: 'Legend',
  grandmaster: 'Grandmaster',
  godlike: 'Godlike'
};

export const SKYBLOCK_PROFILE_EMOJIS: {
  [key: string]: string;
} = {
  Apple: '🍎',
  Banana: '🍌',
  Blueberry: '🫐',
  Coconut: '🥥',
  Cucumber: '🥒',
  Grapes: '🍇',
  Kiwi: '🥝',
  Lemon: '🍋',
  Lime: '🟢',
  Mango: '🥭',
  Orange: '🍊',
  Papaya: '🥑',
  Peach: '🍑',
  Pear: '🍐',
  Pineapple: '🍍',
  Pomegranate: '👛',
  Raspberry: '6️⃣',
  Strawberry: '🍓',
  Tomato: '🍅',
  Watermelon: '🍉',
  Zucchini: '🥬'
};

export const STAFF_COLOURED: {
  [key: string]: string;
} = {
  ADMIN: '§c[ADMIN]',
  OWNER: '§c[OWNER]',
  MODERATOR: '§2[MOD]',
  HELPER: '§9[HELPER]',
  YOUTUBER: '§c[§fYOUTUBE§c]'
};

export const STAFF_PLAIN: {
  [key: string]: string;
} = {
  ADMIN: '[ADMIN]',
  OWNER: '[OWNER]',
  MODERATOR: '[MOD]',
  HELPER: '[HELPER]',
  YOUTUBER: '[YOUTUBE]'
};

export const NAME_TO_HEX: {
  [key: string]: string;
} = {
  BLACK: '#000000',
  DARK_BLUE: '#0000aa',
  DARK_GREEN: '#00aa00',
  DARK_AQUA: '#00aaaa',
  DARK_RED: '#aa0000',
  DARK_PURPLE: '#aa00aa',
  GOLD: '#ffaa00',
  GRAY: '#aaaaaa',
  DARK_GRAY: '#555555',
  BLUE: '#5555ff',
  GREEN: '#55ff55',
  AQUA: '#55ffff',
  RED: '#ff5555',
  LIGHT_PURPLE: '#ff55ff',
  YELLOW: '#ffff55',
  WHITE: '#ffffff'
};

export const CHAR_TO_HEX: {
  [key: string]: string;
} = {
  0: '#000000',
  1: '#0000aa',
  2: '#00aa00',
  3: '#00aaaa',
  4: '#aa0000',
  5: '#aa00aa',
  6: '#ffaa00',
  7: '#aaaaaa',
  8: '#555555',
  9: '#5555ff',
  a: '#55ff55',
  b: '#55ffff',
  c: '#ff5555',
  d: '#ff55ff',
  e: '#ffff55',
  f: '#ffffff'
};

export const NAME_TO_COLOUR: {
  [key: string]: string;
} = {
  BLACK: '§0',
  DARK_BLUE: '§1',
  DARK_GREEN: '§2',
  DARK_AQUA: '§3',
  DARK_RED: '§4',
  DARK_PURPLE: '§5',
  GOLD: '§6',
  GRAY: '§7',
  DARK_GRAY: '§8',
  BLUE: '§9',
  GREEN: '§a',
  AQUA: '§b',
  RED: '§c',
  LIGHT_PURPLE: '§d',
  YELLOW: '§e',
  WHITE: '§f'
};

export const INTERNAL_GAME_ID_FORMAT: {
  [key: string]: string;
} = {
  2: 'Quakecraft',
  3: 'Walls',
  4: 'Paintball',
  5: 'Blitz Survival Games',
  6: 'TNT Games',
  7: 'VampireZ',
  13: 'Mega Walls',
  14: 'Arcade',
  17: 'Arena Brawl',
  20: 'UHC Champions',
  21: 'Cops and Crims',
  23: 'Warlords',
  24: 'Smash Heroes',
  25: 'Turbo Kart Racers',
  26: 'Housing',
  51: 'SkyWars',
  52: 'Crazy Walls',
  54: 'Speed UHC',
  55: 'SkyClash',
  56: 'Classic Games',
  57: 'Prototype',
  58: 'Bed Wars',
  59: 'Murder Mystery',
  60: 'Build Battle',
  61: 'Duels',
  63: 'SkyBlock',
  64: 'Pit'
};

export const INTERNAL_GAME_NAME_FORMAT: {
  [key: string]: string;
} = {
  QUAKECRAFT: 'Quakecraft',
  WALLS: 'Walls',
  PAINTBALL: 'Paintball',
  SURVIVAL_GAMES: 'Blitz Survival Games',
  TNTGAMES: 'TNT Games',
  VAMPIREZ: 'VampireZ',
  WALLS3: 'Mega Walls',
  ARCADE: 'Arcade',
  ARENA: 'Arena Brawl',
  MCGO: 'Cops and Crims',
  UHC: 'UHC Champions',
  BATTLEGROUND: 'Warlords',
  SUPER_SMASH: 'Smash Heroes',
  GINGERBREAD: 'Turbo Kart Racers',
  HOUSING: 'Housing',
  SKYWARS: 'SkyWars',
  TRUE_COMBAT: 'Crazy Walls',
  SPEED_UHC: 'Speed UHC',
  SKYCLASH: 'SkyClash',
  LEGACY: 'Classic Games',
  PROTOTYPE: 'Prototype',
  BEDWARS: 'Bed Wars',
  MURDER_MYSTERY: 'Murder Mystery',
  BUILD_BATTLE: 'Build Battle',
  DUELS: 'Duels',
  SKYBLOCK: 'SkyBlock',
  PIT: 'Pit'
};

export const BEDWARS_XP = [500, 1000, 2000, 3500];
export const BEDWARS_XP_PER_PRESTIGE = 96 * 5000 + 7000;
export const SKYWARS_XP = [0, 20, 50, 80, 100, 250, 500, 1000, 1500, 2500, 4000, 5000];
export const SKYWARS_XP_PER_LEVEL = 10000;
export const BEDWARS_PRESTIGE_FORMAT: (
  string |
  {
    bracket: [ string, string ],
    colours: [ string, string, string, string, string ],
    star: string
  }
)[] = [
  '7', 'f', '6', 'b', '2', '3', '4', 'd', '9', '5',
  { bracket: ['c', '5'], colours: ['6', 'e', 'a', 'b', 'd'], star: '✫' },
  { bracket: ['7', '7'], colours: ['f', 'f', 'f', 'f', '7'], star: '✪' },
  { bracket: ['7', '7'], colours: ['e', 'e', 'e', 'e', '6'], star: '✪' },
  { bracket: ['7', '7'], colours: ['b', 'b', 'b', 'b', '3'], star: '✪' },
  { bracket: ['7', '7'], colours: ['a', 'a', 'a', 'a', '2'], star: '✪' },
  { bracket: ['7', '7'], colours: ['3', '3', '3', '3', '9'], star: '✪' },
  { bracket: ['7', '7'], colours: ['c', 'c', 'c', 'c', '4'], star: '✪' },
  { bracket: ['7', '7'], colours: ['d', 'd', 'd', 'd', '5'], star: '✪' },
  { bracket: ['7', '7'], colours: ['9', '9', '9', '9', '1'], star: '✪' },
  { bracket: ['7', '7'], colours: ['5', '5', '5', '5', '8'], star: '✪' },
  { bracket: ['8', '8'], colours: ['7', 'f', 'f', '7', '7'], star: '✪' },
  { bracket: ['f', '6'], colours: ['f', 'e', 'e', '6', '6'], star: '⚝' },
  { bracket: ['6', '3'], colours: ['6', 'f', 'f', 'b', '3'], star: '⚝' },
  { bracket: ['5', 'e'], colours: ['5', 'd', 'd', '6', 'e'], star: '⚝' },
  { bracket: ['b', '8'], colours: ['b', 'f', 'f', '7', '7'], star: '⚝' },
  { bracket: ['f', '2'], colours: ['f', 'a', 'a', '2', '2'], star: '⚝' },
  { bracket: ['4', '5'], colours: ['4', 'c', 'c', 'd', '5'], star: '⚝' },
  { bracket: ['e', '8'], colours: ['e', 'f', 'f', '7', '8'], star: '⚝' },
  { bracket: ['a', 'e'], colours: ['a', '2', '2', '6', 'e'], star: '⚝' },
  { bracket: ['b', '1'], colours: ['b', '3', '3', '9', '1'], star: '⚝' },
  { bracket: ['e', '4'], colours: ['e', '6', '6', 'c', '4'], star: '⚝' },
];

export default class HypixelUtil {
  private client: Main;

  constructor(client: Main) {
    this.client = client;
  }

  public findGuildLeader(guild: Guild) {
    return guild.members.find(m =>
      ['guild master', 'guildmaster'].includes(m.rank.toLowerCase())
    );
  }

  public formatGameName(id: string | number) {
    return typeof id === 'number'
      ? INTERNAL_GAME_ID_FORMAT[id]
      : INTERNAL_GAME_NAME_FORMAT[id];
  }

  public calculateNetworkLevelProgress(experience: number) {
    const currentLevel = this.calculateNetworkLevel(experience);

    const base = this.calculateNetworkExperience(currentLevel);
    const next = this.calculateNetworkExperience(currentLevel + 1);

    return {
      current: currentLevel,
      progress: (experience - base) / (next - base)
    };
  }

  public calculateNetworkExperience(level: number, round = true) {
    const experience = 1250 * (level ** 2 + 5 * level - 6);

    return round ? Math.round(experience) : experience;
  }

  public calculateNetworkLevel(experience: number, round = true) {
    const level = Math.max(
      1 + (-8750 + (8750 ** 2 + 5000 * experience) ** 0.5) / 2500,
      1
    );

    return round ? Math.round(level) : level;
  }

  public computeDuelsTitle(player: Player, colour = false) {
    const raw = player.stats?.Duels?.active_cosmetictitle;

    if (raw === undefined)
      return null;

    if (raw === 'cosmetictitle_supervillain')
      return colour ? `${NAME_TO_COLOUR['DARK_BLUE']}Supervillain` : 'Supervillain';
    else if (raw === 'cosmetictitle_assassin')
      return colour ? `${NAME_TO_COLOUR['RED']}Assassin` : 'Assassin';
    else if (raw === 'cosmetictitle_lazy')
      return colour ? `${NAME_TO_COLOUR['LIGHT_PURPLE']}Lazy` : 'Lazy';

    let [ type, mode ] = raw.split('_');

    if (mode === 'mega')
      mode = 'mw';
    else if (mode === 'skywars')
      mode = 'sw';

    const wins = player.stats.Duels[mode === 'all' ? 'wins' : `${mode}_duel_wins`] as number;
    const levels = DUELS_TITLE_WINS[mode === 'all' ? 'overall' : 'specific'][type];
    const tier = levels.findIndex(e => e > wins) - 1;
    const title = `${mode === 'all' ? '' : `${DUELS_GAME_FORMAT[mode]} `}${DUELS_TITLE_FORMAT[type]}${tier === -1 || tier === 0 ? '' : ` ${ROMAN_NUMERALS[tier === -2 ? levels.length - 1 : tier]}`}`;

    return colour ? `${DUELS_TITLE_COLOUR[type]}${title}` : title;
  }

  public computeBedWarsLevelDisplay(level: number) {
    const string = level.toString();
    const colour = BEDWARS_PRESTIGE_FORMAT[Math.min(Math.floor(level / 100), BEDWARS_PRESTIGE_FORMAT.length - 1)];

    return typeof colour === 'string' ? `§${colour}[${string}✫]`
      : `§${colour.bracket[0]}[${string.split('').map((l, i) => `§${colour.colours[i % colour.colours.length]}${l}`).join('')}§${colour.colours[colour.colours.length - 1]}${colour.star}§${colour.bracket[1]}]`;
  }

  public computeDisplayName(player: Player, colour = false) {
    if (colour === false) {
      return player.prefix
        ? `${player.prefix.replace(/§\w/g, '')} ${player.displayname}`
        : player.rank && STAFF_PLAIN[player.rank]
        ? `${STAFF_PLAIN[player.rank]} ${player.displayname}`
        : player.newPackageRank?.startsWith('MVP')
        ? `${
            player.monthlyPackageRank === 'SUPERSTAR'
              ? '[MVP++]'
              : player.newPackageRank !== 'MVP'
              ? '[MVP+]'
              : '[MVP]'
          } ${player.displayname}`
        : player.newPackageRank && player.newPackageRank !== 'NONE'
        ? `[${player.newPackageRank.replace('_PLUS', '+')}] ${
            player.displayname
          }`
        : player.displayname;
    }

    return player.prefix
      ? `${player.prefix} ${player.displayname}`
      : player.rank && STAFF_COLOURED[player.rank]
      ? `${STAFF_COLOURED[player.rank]} ${player.displayname}`
      : player.newPackageRank?.startsWith('MVP')
      ? `${
          player.monthlyPackageRank === 'SUPERSTAR'
            ? `${NAME_TO_COLOUR[player.monthlyRankColor ?? 'GOLD']}[MVP${
                NAME_TO_COLOUR[player.rankPlusColor ?? 'RED']
              }++${NAME_TO_COLOUR[player.monthlyRankColor ?? 'GOLD']}] ${
                player.displayname
              }`
            : `§b[MVP${
                player.newPackageRank !== 'MVP'
                  ? `${NAME_TO_COLOUR[player.rankPlusColor ?? 'RED']}+`
                  : ''
              }§b] ${player.displayname}`
        }`
      : player.newPackageRank && player.newPackageRank !== 'NONE'
      ? `§a[${player.newPackageRank.replace('_PLUS', '+')}] ${
          player.displayname
        }`
      : `§7${player.displayname}`;
  }

  public calculateBedWarsLevel(exp: number) {
    let level = 100 * Math.floor(exp / 487000);
    exp = exp % 487000;
    if (exp < 500) return level + exp / 500;
    level++;
    if (exp < 1500) return level + (exp - 500) / 1000;
    level++;
    if (exp < 3500) return level + (exp - 1500) / 2000;
    level++;
    if (exp < 7000) return level + (exp - 3500) / 3500;
    level++;
    exp -= 7000;
    return level + exp / 5000;
  }

  public calculateBedWarsExperience(level: number) {
    const prestiges = Math.floor(level / 100);
    const levels = level % 100;

    let experience = prestiges * BEDWARS_XP_PER_PRESTIGE;

    for (let i = 0; i < BEDWARS_XP.length && i < levels; ++i) {
      experience += BEDWARS_XP[i];
    }

    return experience + Math.max(0, levels - BEDWARS_XP.length) * 5000;
  }

  public calculateBedWarsLevelProgress(experience: number) {
    const currentLevel = Math.floor(this.calculateBedWarsLevel(experience));

    const base = this.calculateBedWarsExperience(currentLevel);
    const next = this.calculateBedWarsExperience(currentLevel + 1);

    return {
      level: currentLevel,
      current: experience - base,
      required: next - base,
      progress: Math.min(1, (experience - base) / ((next - base) || 1))
    };
  }

  public calculateSkyWarsLevelProgress(experience: number) {
    const currentLevel = this.calculateSkyWarsLevel(experience);

    const base = this.calculateSkyWarsExperience(currentLevel);
    const next = this.calculateSkyWarsExperience(currentLevel + 1);

    return {
      level: currentLevel,
      current: experience - base,
      required: next - base,
      progress: Math.min(1, (experience - base) / ((next - base) || 1))
    };
  }

  public calculateSkyWarsExperience(level: number) {
    let experience = 0;

    for (let i = 0; i < level && i < SKYWARS_XP.length; ++i) {
      experience += SKYWARS_XP[i];
    }

    if (level > SKYWARS_XP.length) {
      experience += (level - SKYWARS_XP.length) * SKYWARS_XP_PER_LEVEL;
    }

    return experience;
  }

  public calculateSkyWarsLevel(experience: number, round = true) {
    let easyExperience = 0;

    for (const [i, xp] of SKYWARS_XP.entries()) {
      easyExperience += xp;

      if (experience < easyExperience) {
        return i;
      }
    }

    const level = SKYWARS_XP.length + (experience - easyExperience) / SKYWARS_XP_PER_LEVEL;

    return round ? Math.floor(level) : level;
  }

  public formatBridge(player: Player): BridgeData {
    const stats = player.stats?.Duels ?? {};

    const data: any = {
      solo: {
        kills: stats.bridge_duel_bridge_kills ?? 0,
        deaths: stats.bridge_duel_bridge_deaths ?? 0,
        wins: stats.bridge_duel_wins ?? 0,
        losses: stats.bridge_duel_losses ?? 0
      },
      doubles: {
        kills: stats.bridge_doubles_bridge_kills ?? 0,
        deaths: stats.bridge_doubles_bridge_deaths ?? 0,
        wins: stats.bridge_doubles_wins ?? 0,
        losses: stats.bridge_doubles_losses ?? 0
      },
      four_two: {
        kills: stats.bridge_2v2v2v2_bridge_kills ?? 0,
        deaths: stats.bridge_2v2v2v2_bridge_deaths ?? 0,
        wins: stats.bridge_2v2v2v2_wins ?? 0,
        losses: stats.bridge_2v2v2v2_losses ?? 0
      },
      four_three: {
        kills: stats.bridge_3v3v3v3_bridge_kills ?? 0,
        deaths: stats.bridge_3v3v3v3_bridge_deaths ?? 0,
        wins: stats.bridge_3v3v3v3_wins ?? 0,
        losses: stats.bridge_3v3v3v3_losses ?? 0
      },
      fours: {
        kills: stats.bridge_four_bridge_kills ?? 0,
        deaths: stats.bridge_four_bridge_deaths ?? 0,
        wins: stats.bridge_four_wins ?? 0,
        losses: stats.bridge_four_losses ?? 0
      }
    };

    data.overall = {
      kills:
        data.solo.kills +
        data.doubles.kills +
        data.four_two.kills +
        data.four_three.kills +
        data.fours.kills,
      deaths:
        data.solo.deaths +
        data.doubles.deaths +
        data.four_two.deaths +
        data.four_three.deaths +
        data.fours.deaths,
      wins:
        data.solo.wins +
        data.doubles.wins +
        data.four_two.wins +
        data.four_three.wins +
        data.fours.wins,
      losses:
        data.solo.losses +
        data.doubles.losses +
        data.four_two.losses +
        data.four_three.losses +
        data.fours.losses
    };

    data.overall.kill_death_ratio = this.client.util.divide(
      data.overall.kills,
      data.overall.deaths
    );
    data.overall.win_loss_ratio = this.client.util.divide(
      data.overall.wins,
      data.overall.losses
    );

    data.solo.kill_death_ratio = this.client.util.divide(
      data.solo.kills,
      data.solo.deaths
    );
    data.solo.win_loss_ratio = this.client.util.divide(
      data.solo.wins,
      data.solo.losses
    );

    data.doubles.kill_death_ratio = this.client.util.divide(
      data.doubles.kills,
      data.doubles.deaths
    );
    data.doubles.win_loss_ratio = this.client.util.divide(
      data.doubles.wins,
      data.doubles.losses
    );

    data.four_two.kill_death_ratio = this.client.util.divide(
      data.four_two.kills,
      data.four_two.deaths
    );
    data.four_two.win_loss_ratio = this.client.util.divide(
      data.four_two.wins,
      data.four_two.losses
    );

    data.four_three.kill_death_ratio = this.client.util.divide(
      data.four_three.kills,
      data.four_three.deaths
    );
    data.four_three.win_loss_ratio = this.client.util.divide(
      data.four_three.wins,
      data.four_three.losses
    );

    data.fours.kill_death_ratio = this.client.util.divide(
      data.fours.kills,
      data.fours.deaths
    );
    data.fours.win_loss_ratio = this.client.util.divide(
      data.fours.wins,
      data.fours.losses
    );

    return data;
  }

  public formatSkyWars(player: Player): SkyWarsData {
    const stats = player.stats?.SkyWars ?? {};
    const level = this.calculateSkyWarsLevel(stats.skywars_experience ?? 0);

    const data: any = {
      overall: {
        level,
        coins: stats.coins,
        wins: stats.wins ?? 0,
        losses: stats.losses ?? 0,
        kills: stats.kills ?? 0,
        deaths: stats.deaths ?? 0,
        heads: stats.heads ?? 0,
        blocks_placed: stats.blocks_placed ?? 0,
        blocks_broken: stats.blocks_broken ?? 0,
        prefix: stats.levelFormatted ?? level,
        experience: stats.skywars_experience ?? 0,
        winstreak: stats.winstreak ?? 0
      },
      solo_normal: {
        wins: stats.wins_solo_normal ?? 0,
        losses: stats.losses_solo_normal ?? 0,
        kills: stats.kills_solo_normal ?? 0,
        deaths: stats.deaths_solo_normal ?? 0,
        heads: stats.heads_solo ?? 0,
        winstreak: stats.winstreak_solo ?? 0
      },
      teams_normal: {
        wins: stats.wins_team_normal ?? 0,
        losses: stats.losses_team_normal ?? 0,
        kills: stats.kills_team_normal ?? 0,
        deaths: stats.deaths_team_normal ?? 0,
        heads: stats.heads_team ?? 0,
        winstreak: stats.winstreak_team ?? 0
      },
      mega: {
        wins: stats.wins_mega ?? 0,
        losses: stats.losses_mega ?? 0,
        kills: stats.kills_mega ?? 0,
        deaths: stats.deaths_mega ?? 0,
        winstreak: stats.winstreak_mega ?? 0
      },
      solo_insane: {
        wins: stats.wins_solo_insane ?? 0,
        losses: stats.losses_solo_insane ?? 0,
        kills: stats.kills_solo_insane ?? 0,
        deaths: stats.deaths_solo_insane ?? 0,
        winstreak: stats.winstreak_solo ?? 0
      },
      teams_insane: {
        wins: stats.wins_team_insane ?? 0,
        losses: stats.losses_team_insane ?? 0,
        kills: stats.kills_team_insane ?? 0,
        deaths: stats.deaths_team_insane ?? 0,
        winstreak: stats.winstreak_team ?? 0
      },
      lucky: {
        wins:
          (stats.lab_win_lucky_blocks_lab ?? 0) +
          (stats.lab_win_lucky_blocks_lab_solo ?? 0) +
          (stats.lab_win_lucky_blocks_lab_team ?? 0)
      },
      rush: {
        wins:
          (stats.lab_win_rush_lab ?? 0) +
          (stats.lab_win_rush_lab_solo ?? 0) +
          (stats.lab_win_rush_lab_team ?? 0)
      }
    };

    data.overall.kill_death_ratio = this.client.util.divide(
      data.overall.kills,
      data.overall.deaths
    );
    data.overall.win_loss_ratio = this.client.util.divide(
      data.overall.wins,
      data.overall.losses
    );

    data.solo_normal.kill_death_ratio = this.client.util.divide(
      data.solo_normal.kills,
      data.solo_normal.deaths
    );
    data.solo_normal.win_loss_ratio = this.client.util.divide(
      data.solo_normal.wins,
      data.solo_normal.losses
    );

    data.teams_normal.kill_death_ratio = this.client.util.divide(
      data.teams_normal.kills,
      data.teams_normal.deaths
    );
    data.teams_normal.win_loss_ratio = this.client.util.divide(
      data.teams_normal.wins,
      data.teams_normal.losses
    );

    data.mega.kill_death_ratio = this.client.util.divide(
      data.mega.kills,
      data.mega.deaths
    );
    data.mega.win_loss_ratio = this.client.util.divide(
      data.mega.wins,
      data.mega.losses
    );

    data.solo_insane.kill_death_ratio = this.client.util.divide(
      data.solo_insane.kills,
      data.solo_insane.deaths
    );
    data.solo_insane.win_loss_ratio = this.client.util.divide(
      data.solo_insane.wins,
      data.solo_insane.losses
    );

    data.teams_insane.kill_death_ratio = this.client.util.divide(
      data.teams_insane.kills,
      data.teams_insane.deaths
    );
    data.teams_insane.win_loss_ratio = this.client.util.divide(
      data.teams_insane.wins,
      data.teams_insane.losses
    );

    return data;
  }

  public formatBedWars(player: Player): BedWarsData {
    const stats = player.stats?.Bedwars ?? {};

    const data: any = {
      overall: {
        coins: stats.coins ?? 0,
        level: player.achievements?.bedwars_level ?? 0,
        experience: stats.Experience ?? 0,
        beds_broken: stats.beds_broken_bedwars ?? 0,
        beds_lost: stats.beds_lost_bedwars ?? 0,
        winstreak: stats.winstreak ?? 0,
        kills: stats.kills_bedwars ?? 0,
        deaths: stats.deaths_bedwars ?? 0,
        wins: stats.wins_bedwars ?? 0,
        losses: stats.losses_bedwars ?? 0,
        final_kills: stats.final_kills_bedwars ?? 0,
        final_deaths: stats.final_deaths_bedwars ?? 0
      },
      eight_one: {
        kills: stats.eight_one_kills_bedwars ?? 0,
        deaths: stats.eight_one_deaths_bedwars ?? 0,
        wins: stats.eight_one_wins_bedwars ?? 0,
        losses: stats.eight_one_losses_bedwars ?? 0,
        winstreak: stats.eight_one_winstreak ?? 0,
        beds_broken: stats.eight_one_beds_broken_bedwars ?? 0,
        beds_lost: stats.eight_one_beds_lost_bedwars ?? 0,
        final_kills: stats.eight_one_final_kills_bedwars ?? 0,
        final_deaths: stats.eight_one_final_deaths_bedwars ?? 0
      },
      eight_two: {
        kills: stats.eight_two_kills_bedwars ?? 0,
        deaths: stats.eight_two_deaths_bedwars ?? 0,
        wins: stats.eight_two_wins_bedwars ?? 0,
        losses: stats.eight_two_losses_bedwars ?? 0,
        winstreak: stats.eight_two_winstreak ?? 0,
        beds_broken: stats.eight_two_beds_broken_bedwars ?? 0,
        beds_lost: stats.eight_two_beds_lost_bedwars ?? 0,
        final_kills: stats.eight_two_final_kills_bedwars ?? 0,
        final_deaths: stats.eight_two_final_deaths_bedwars ?? 0
      },
      four_three: {
        kills: stats.four_three_kills_bedwars ?? 0,
        deaths: stats.four_three_deaths_bedwars ?? 0,
        wins: stats.four_three_wins_bedwars ?? 0,
        losses: stats.four_three_losses_bedwars ?? 0,
        winstreak: stats.four_three_winstreak ?? 0,
        beds_broken: stats.four_three_beds_broken_bedwars ?? 0,
        beds_lost: stats.four_three_beds_lost_bedwars ?? 0,
        final_kills: stats.four_three_final_kills_bedwars ?? 0,
        final_deaths: stats.four_three_final_deaths_bedwars ?? 0
      },
      four_four: {
        kills: stats.four_four_kills_bedwars ?? 0,
        deaths: stats.four_four_deaths_bedwars ?? 0,
        wins: stats.four_four_wins_bedwars ?? 0,
        losses: stats.four_four_losses_bedwars ?? 0,
        winstreak: stats.four_four_winstreak ?? 0,
        beds_broken: stats.four_four_beds_broken_bedwars ?? 0,
        beds_lost: stats.four_four_beds_lost_bedwars ?? 0,
        final_kills: stats.four_four_final_kills_bedwars ?? 0,
        final_deaths: stats.four_four_final_deaths_bedwars ?? 0
      },
      two_four: {
        kills: stats.two_four_kills_bedwars ?? 0,
        deaths: stats.two_four_deaths_bedwars ?? 0,
        wins: stats.two_four_wins_bedwars ?? 0,
        losses: stats.two_four_losses_bedwars ?? 0,
        winstreak: stats.two_four_winstreak ?? 0,
        beds_broken: stats.two_four_beds_broken_bedwars ?? 0,
        beds_lost: stats.two_four_beds_lost_bedwars ?? 0,
        final_kills: stats.two_four_final_kills_bedwars ?? 0,
        final_deaths: stats.two_four_final_deaths_bedwars ?? 0
      },
      armed: {
        kills: stats.four_four_armed_kills_bedwars ?? 0,
        deaths: stats.four_four_armed_deaths_bedwars ?? 0,
        wins: stats.four_four_armed_wins_bedwars ?? 0,
        losses: stats.four_four_armed_losses_bedwars ?? 0,
        winstreak: stats.four_four_armed_winstreak ?? 0,
        beds_broken: stats.four_four_armed_beds_broken_bedwars ?? 0,
        beds_lost: stats.four_four_armed_beds_lost_bedwars ?? 0,
        final_kills: stats.four_four_armed_final_kills_bedwars ?? 0,
        final_deaths: stats.four_four_armed_final_deaths_bedwars ?? 0
      },
      ultimate: {
        kills: stats.four_four_ultimate_kills_bedwars ?? 0,
        deaths: stats.four_four_ultimate_deaths_bedwars ?? 0,
        wins: stats.four_four_ultimate_wins_bedwars ?? 0,
        losses: stats.four_four_ultimate_losses_bedwars ?? 0,
        winstreak: stats.four_four_ultimate_winstreak ?? 0,
        beds_broken: stats.four_four_ultimate_beds_broken_bedwars ?? 0,
        beds_lost: stats.four_four_ultimate_beds_lost_bedwars ?? 0,
        final_kills: stats.four_four_ultimate_final_kills_bedwars ?? 0,
        final_deaths: stats.four_four_ultimate_final_deaths_bedwars ?? 0
      },
      rush: {
        kills: stats.eight_two_rush_kills_bedwars ?? 0,
        deaths: stats.eight_two_rush_deaths_bedwars ?? 0,
        wins: stats.eight_two_rush_wins_bedwars ?? 0,
        losses: stats.eight_two_rush_losses_bedwars ?? 0,
        winstreak: stats.eight_two_rush_winstreak ?? 0,
        beds_broken: stats.eight_two_rush_beds_broken_bedwars ?? 0,
        beds_lost: stats.eight_two_rush_beds_lost_bedwars ?? 0,
        final_kills: stats.eight_two_rush_final_kills_bedwars ?? 0,
        final_deaths: stats.eight_two_rush_final_deaths_bedwars ?? 0
      },
      castle: {
        kills: stats.castle_kills_bedwars ?? 0,
        deaths: stats.castle_deaths_bedwars ?? 0,
        wins: stats.castle_wins_bedwars ?? 0,
        losses: stats.castle_losses_bedwars ?? 0,
        winstreak: stats.castle_winstreak ?? 0,
        beds_broken: stats.castle_beds_broken_bedwars ?? 0,
        beds_lost: stats.castle_beds_lost_bedwars ?? 0,
        final_kills: stats.castle_final_kills_bedwars ?? 0,
        final_deaths: stats.castle_final_deaths_bedwars ?? 0
      }
    };

    for (const key in data) {
      data[key].beds_per_game = this.client.util.divide(
        data[key].beds_broken,
        data[key].wins + data[key].losses
      );
      data[key].beds_broken_per_loss = this.client.util.divide(
        data[key].beds_broken,
        data[key].beds_lost
      );
      data[key].win_loss_ratio = this.client.util.divide(
        data[key].wins,
        data[key].losses
      );
      data[key].kill_death_ratio = this.client.util.divide(
        data[key].kills,
        data[key].deaths
      );
      data[key].final_kill_death_ratio = this.client.util.divide(
        data[key].final_kills,
        data[key].final_deaths
      );
      data[key].final_kills_per_game = this.client.util.divide(
        data[key].final_kills,
        data[key].wins + data[key].losses
      );
      data[key].clutch_rate = this.client.util.divide(
        data[key].beds_lost - data[key].losses,
        data[key].beds_lost
      );
    }

    return data;
  }

  public async computeBuildBattlePrefix(player: Player, colour = false) {
    const score = player.stats?.BuildBattle?.score ?? 0;

    if (colour === false) {
      if (score >= 20000) {
        const { BUILD_BATTLE: board } =
          await this.client.hypixel.leaderboards();

        return board
          .find(s => s.path === 'score')!
          .leaders.slice(0, 10)
          .some(u => u.replace(/-/g, '') === player.uuid)
          ? '#1 Builder'
          : 'Master';
      }

      if (score < 100) return 'Rookie';
      if (score < 250) return 'Untrained';
      if (score < 500) return 'Amateur';
      if (score < 1000) return 'Apprentice';
      if (score < 2000) return 'Experienced';
      if (score < 3500) return 'Seasoned';
      if (score < 5000) return 'Trained';
      if (score < 7500) return '§killed';
      if (score < 10000) return 'Talented';
      if (score < 15000) return 'Professional';
      if (score < 20000) return 'Expert';
    }

    if (score >= 20000) {
      const { BUILD_BATTLE: board } = await this.client.hypixel.leaderboards();

      return board
        .find(s => s.path === 'score')!
        .leaders.slice(0, 10)
        .some(u => u.replace(/-/g, '') === player.uuid)
        ? '§6#1 Builder'
        : '§4Master';
    }

    if (score < 100) return '§fRookie';
    if (score < 250) return '§8Untrained';
    if (score < 500) return '§eAmateur';
    if (score < 1000) return '§aApprentice';
    if (score < 2000) return '§dExperienced';
    if (score < 3500) return '§9Seasoned';
    if (score < 5000) return '§2Trained';
    if (score < 7500) return '§3Skilled';
    if (score < 10000) return '§cTalented';
    if (score < 15000) return '§5Professional';
    if (score < 20000) return '§1Expert';
  }

  public formatDuels(player: Player): DuelsData {
    const stats = player.stats?.Duels ?? {};

    const data: any = {
      overall: {
        wins: stats.wins ?? 0,
        losses: stats.losses ?? 0,
        best_winstreak: stats.best_overall_winstreak ?? 0,
        winstreak: stats.current_winstreak ?? 0,
        blocks_placed: stats.blocks_placed ?? 0,
        melee_accuracy:
          this.client.util.divide(stats.melee_hits, stats.melee_swings) * 100,
        bow_accuracy:
          this.client.util.divide(stats.bow_hits, stats.bow_shots) * 100,
        kills: stats?.kills ?? 0,
        deaths: stats?.deaths ?? 0
      },
      solo_uhc: {
        kills: stats.uhc_duel_kills ?? 0,
        deaths: stats.uhc_duel_deaths ?? 0,
        wins: stats.uhc_duel_wins ?? 0,
        losses: stats.uhc_duel_losses ?? 0,
        bow_accuracy:
          this.client.util.divide(
            stats.uhc_duel_bow_hits,
            stats.uhc_duel_bow_shots
          ) * 100
      },
      doubles_uhc: {
        kills: stats.uhc_doubles_kills ?? 0,
        deaths: stats.uhc_doubles_deaths ?? 0,
        wins: stats.uhc_doubles_wins ?? 0,
        losses: stats.uhc_doubles_losses ?? 0,
        bow_accuracy:
          this.client.util.divide(
            stats.uhc_doubles_bow_hits,
            stats.uhc_doubles_bow_shots
          ) * 100
      },
      solo_skywars: {
        kills: stats.sw_duel_kills ?? 0,
        deaths: stats.sw_duel_deaths ?? 0,
        wins: stats.sw_duel_wins ?? 0,
        losses: stats.sw_duel_losses ?? 0
      },
      doubles_skywars: {
        kills: stats.sw_doubles_kills ?? 0,
        deaths: stats.sw_doubles_deaths ?? 0,
        wins: stats.sw_doubles_wins ?? 0,
        losses: stats.sw_doubles_losses ?? 0
      },
      solo_mega_walls: {
        kills: stats.mw_duel_kills ?? 0,
        deaths: stats.mw_duel_deaths ?? 0,
        wins: stats.mw_duel_wins ?? 0,
        losses: stats.mw_duel_losses ?? 0
      },
      doubles_mega_walls: {
        kills: stats.mw_doubles_kills ?? 0,
        deaths: stats.mw_doubles_deaths ?? 0,
        wins: stats.mw_doubles_wins ?? 0,
        losses: stats.mw_doubles_losses ?? 0
      },
      solo_combo: {
        kills: stats.combo_duel_kills ?? 0,
        deaths: stats.combo_duel_deaths ?? 0,
        wins: stats.combo_duel_wins ?? 0,
        losses: stats.combo_duel_losses ?? 0
      },
      doubles_combo: {
        kills: stats.combo_doubles_kills ?? 0,
        deaths: stats.combo_doubles_deaths ?? 0,
        wins: stats.combo_doubles_wins ?? 0,
        losses: stats.combo_doubles_losses ?? 0
      },
      solo_no_debuff: {
        kills: stats.no_debuff_duel_kills ?? 0,
        deaths: stats.no_debuff_duel_deaths ?? 0,
        wins: stats.no_debuff_duel_wins ?? 0,
        losses: stats.no_debuff_duel_losses ?? 0
      },
      doubles_no_debuff: {
        kills: stats.no_debuff_doubles_kills ?? 0,
        deaths: stats.no_debuff_doubles_deaths ?? 0,
        wins: stats.no_debuff_doubles_wins ?? 0,
        losses: stats.no_debuff_doubles_losses ?? 0
      },
      solo_classic: {
        kills: stats.classic_duel_kills ?? 0,
        deaths: stats.classic_duel_deaths ?? 0,
        wins: stats.classic_duel_wins ?? 0,
        losses: stats.classic_duel_losses ?? 0
      },
      doubles_classic: {
        kills: stats.classic_doubles_kills ?? 0,
        deaths: stats.classic_doubles_deaths ?? 0,
        wins: stats.classic_doubles_wins ?? 0,
        losses: stats.classic_doubles_losses ?? 0
      },
      solo_bow: {
        kills: stats.bow_duel_kills ?? 0,
        deaths: stats.bow_duel_deaths ?? 0,
        wins: stats.bow_duel_wins ?? 0,
        losses: stats.bow_duel_losses ?? 0
      },
      doubles_bow: {
        kills: stats.bow_doubles_kills ?? 0,
        deaths: stats.bow_doubles_deaths ?? 0,
        wins: stats.bow_doubles_wins ?? 0,
        losses: stats.bow_doubles_losses ?? 0
      },
      solo_op: {
        kills: stats.op_duel_kills ?? 0,
        deaths: stats.op_duel_deaths ?? 0,
        wins: stats.op_duel_wins ?? 0,
        losses: stats.op_duel_losses ?? 0
      },
      doubles_op: {
        kills: stats.op_doubles_kills ?? 0,
        deaths: stats.op_doubles_deaths ?? 0,
        wins: stats.op_doubles_wins ?? 0,
        losses: stats.op_doubles_losses ?? 0
      },
      solo_bowspleef: {
        kills: stats.bowspleef_duel_kills ?? 0,
        deaths: stats.bowspleef_duel_deaths ?? 0,
        wins: stats.bowspleef_duel_wins ?? 0,
        losses: stats.bowspleef_duel_losses ?? 0
      },
      solo_sumo: {
        kills: stats.sumo_duel_kills ?? 0,
        deaths: stats.sumo_duel_deaths ?? 0,
        wins: stats.sumo_duel_wins ?? 0,
        losses: stats.sumo_duel_losses ?? 0
      },
      skywars_tournament: {
        kills: stats.sw_tournament_kills ?? 0,
        deaths: stats.sw_tournament_deaths ?? 0,
        wins: stats.sw_tournament_wins ?? 0,
        losses: stats.sw_tournament_losses ?? 0
      },
      op_tournament: {
        kills: stats.op_tournament_kills ?? 0,
        deaths: stats.op_tournament_deaths ?? 0,
        wins: stats.op_tournament_wins ?? 0,
        losses: stats.op_tournament_losses ?? 0
      }
    };

    data.overall.kill_death_ratio = this.client.util.divide(
      data.overall.kills,
      data.overall.deaths
    );
    data.overall.games_played = data.overall.wins + data.overall.losses;
    data.overall.win_loss_ratio = this.client.util.divide(
      data.overall.wins,
      data.overall.losses
    );

    data.solo_uhc.win_loss_ratio = this.client.util.divide(
      data.solo_uhc.wins,
      data.solo_uhc.losses
    );
    data.solo_uhc.kill_death_ratio = this.client.util.divide(
      data.solo_uhc.kills,
      data.solo_uhc.deaths
    );

    data.doubles_uhc.win_loss_ratio = this.client.util.divide(
      data.doubles_uhc.wins,
      data.doubles_uhc.losses
    );
    data.doubles_uhc.kill_death_ratio = this.client.util.divide(
      data.doubles_uhc.kills,
      data.doubles_uhc.deaths
    );

    data.solo_skywars.win_loss_ratio = this.client.util.divide(
      data.solo_skywars.wins,
      data.solo_skywars.losses
    );
    data.solo_skywars.kill_death_ratio = this.client.util.divide(
      data.solo_skywars.kills,
      data.solo_skywars.deaths
    );

    data.doubles_skywars.win_loss_ratio = this.client.util.divide(
      data.doubles_skywars.wins,
      data.doubles_skywars.losses
    );
    data.doubles_skywars.kill_death_ratio = this.client.util.divide(
      data.doubles_skywars.kills,
      data.doubles_skywars.deaths
    );

    data.solo_mega_walls.win_loss_ratio = this.client.util.divide(
      data.solo_mega_walls.wins,
      data.solo_mega_walls.losses
    );
    data.solo_mega_walls.kill_death_ratio = this.client.util.divide(
      data.solo_mega_walls.kills,
      data.solo_mega_walls.deaths
    );

    data.doubles_mega_walls.win_loss_ratio = this.client.util.divide(
      data.doubles_mega_walls.wins,
      data.doubles_mega_walls.losses
    );
    data.doubles_mega_walls.kill_death_ratio = this.client.util.divide(
      data.doubles_mega_walls.kills,
      data.doubles_mega_walls.deaths
    );

    data.solo_combo.win_loss_ratio = this.client.util.divide(
      data.solo_combo.wins,
      data.solo_combo.losses
    );
    data.solo_combo.kill_death_ratio = this.client.util.divide(
      data.solo_combo.kills,
      data.solo_combo.deaths
    );

    data.doubles_combo.win_loss_ratio = this.client.util.divide(
      data.doubles_combo.wins,
      data.doubles_combo.losses
    );
    data.doubles_combo.kill_death_ratio = this.client.util.divide(
      data.doubles_combo.kills,
      data.doubles_combo.deaths
    );

    data.solo_no_debuff.win_loss_ratio = this.client.util.divide(
      data.solo_no_debuff.wins,
      data.solo_no_debuff.losses
    );
    data.solo_no_debuff.kill_death_ratio = this.client.util.divide(
      data.solo_no_debuff.kills,
      data.solo_no_debuff.deaths
    );

    data.doubles_no_debuff.win_loss_ratio = this.client.util.divide(
      data.doubles_no_debuff.wins,
      data.doubles_no_debuff.losses
    );
    data.doubles_no_debuff.kill_death_ratio = this.client.util.divide(
      data.doubles_no_debuff.kills,
      data.doubles_no_debuff.deaths
    );

    data.solo_classic.win_loss_ratio = this.client.util.divide(
      data.solo_classic.wins,
      data.solo_classic.losses
    );
    data.solo_classic.kill_death_ratio = this.client.util.divide(
      data.solo_classic.kills,
      data.solo_classic.deaths
    );

    data.doubles_classic.win_loss_ratio = this.client.util.divide(
      data.doubles_classic.wins,
      data.doubles_classic.losses
    );
    data.doubles_classic.kill_death_ratio = this.client.util.divide(
      data.doubles_classic.kills,
      data.doubles_classic.deaths
    );

    data.solo_bow.win_loss_ratio = this.client.util.divide(
      data.solo_bow.wins,
      data.solo_bow.losses
    );
    data.solo_bow.kill_death_ratio = this.client.util.divide(
      data.solo_bow.kills,
      data.solo_bow.deaths
    );

    data.doubles_bow.win_loss_ratio = this.client.util.divide(
      data.doubles_bow.wins,
      data.doubles_bow.losses
    );
    data.doubles_bow.kill_death_ratio = this.client.util.divide(
      data.doubles_bow.kills,
      data.doubles_bow.deaths
    );

    data.solo_op.win_loss_ratio = this.client.util.divide(
      data.solo_op.wins,
      data.solo_op.losses
    );
    data.solo_op.kill_death_ratio = this.client.util.divide(
      data.solo_op.kills,
      data.solo_op.deaths
    );

    data.doubles_op.win_loss_ratio = this.client.util.divide(
      data.doubles_op.wins,
      data.doubles_op.losses
    );
    data.doubles_op.kill_death_ratio = this.client.util.divide(
      data.doubles_op.kills,
      data.doubles_op.deaths
    );

    data.solo_bowspleef.win_loss_ratio = this.client.util.divide(
      data.solo_bowspleef.wins,
      data.solo_bowspleef.losses
    );
    data.solo_bowspleef.kill_death_ratio = this.client.util.divide(
      data.solo_bowspleef.kills,
      data.solo_bowspleef.deaths
    );

    data.solo_sumo.win_loss_ratio = this.client.util.divide(
      data.solo_sumo.wins,
      data.solo_sumo.losses
    );
    data.solo_sumo.kill_death_ratio = this.client.util.divide(
      data.solo_sumo.kills,
      data.solo_sumo.deaths
    );

    data.skywars_tournament.win_loss_ratio = this.client.util.divide(
      data.skywars_tournament.wins,
      data.skywars_tournament.losses
    );
    data.skywars_tournament.kill_death_ratio = this.client.util.divide(
      data.skywars_tournament.kills,
      data.skywars_tournament.deaths
    );

    data.op_tournament.win_loss_ratio = this.client.util.divide(
      data.op_tournament.wins,
      data.op_tournament.losses
    );
    data.op_tournament.kill_death_ratio = this.client.util.divide(
      data.op_tournament.kills,
      data.op_tournament.deaths
    );

    return data;
  }

  public formatMurderMystery(player: Player): MurderMysteryData {
    const stats = player.stats?.MurderMystery ?? {};

    const data: any = {
      overall: {
        coins: stats.coins ?? 0,
        games: stats.games ?? 0,
        wins: stats.wins ?? 0,
        kills: stats.kills ?? 0,
        deaths: stats.deaths ?? 0,
        gold: stats.coins_pickedup ?? 0
      },
      classic: {
        games: stats.games_MURDER_CLASSIC ?? 0,
        wins: stats.wins_MURDER_CLASSIC ?? 0,
        kills: stats.kills_MURDER_CLASSIC ?? 0,
        deaths: stats.deaths_MURDER_CLASSIC ?? 0,
        gold: stats.coins_pickedup_MURDER_CLASSIC ?? 0
      },
      double_up: {
        games: stats.games_MURDER_DOUBLE_UP ?? 0,
        wins: stats.wins_MURDER_DOUBLE_UP ?? 0,
        kills: stats.kills_MURDER_DOUBLE_UP ?? 0,
        deaths: stats.deaths_MURDER_DOUBLE_UP ?? 0,
        gold: stats.coins_pickedup_MURDER_DOUBLE_UP ?? 0
      },
      assassins: {
        games: stats.games_MURDER_ASSASSINS ?? 0,
        wins: stats.wins_MURDER_ASSASSINS ?? 0,
        kills: stats.kills_MURDER_ASSASSINS ?? 0,
        deaths: stats.deaths_MURDER_ASSASSINS ?? 0,
        gold: stats.coins_pickedup_MURDER_ASSASSINS ?? 0
      },
      showdown: {
        games: stats.games_MURDER_SHOWDOWN ?? 0,
        wins: stats.wins_MURDER_SHOWDOWN ?? 0,
        kills: stats.kills_MURDER_SHOWDOWN ?? 0,
        deaths: stats.deaths_MURDER_SHOWDOWN ?? 0,
        gold: stats.coins_pickedup_MURDER_SHOWDOWN ?? 0
      },
      infection: {
        games: stats.games_MURDER_INFECTION ?? 0,
        wins: stats.wins_MURDER_INFECTION ?? 0,
        kills: stats.kills_MURDER_INFECTION ?? 0,
        deaths: stats.deaths_MURDER_INFECTION ?? 0,
        gold: stats.coins_pickedup_MURDER_INFECTION ?? 0
      }
    };

    data.overall.kill_death_ratio = this.client.util.divide(
      data.overall.kills,
      data.overall.deaths
    );
    data.classic.kill_death_ratio = this.client.util.divide(
      data.classic.kills,
      data.classic.deaths
    );
    data.double_up.kill_death_ratio = this.client.util.divide(
      data.double_up.kills,
      data.double_up.deaths
    );
    data.assassins.kill_death_ratio = this.client.util.divide(
      data.assassins.kills,
      data.assassins.deaths
    );
    data.showdown.kill_death_ratio = this.client.util.divide(
      data.showdown.kills,
      data.showdown.deaths
    );
    data.infection.kill_death_ratio = this.client.util.divide(
      data.infection.kills,
      data.infection.deaths
    );

    return data;
  }

  public formatBuildBattle(player: Player): BuildBattleData {
    const stats = player.stats?.BuildBattle ?? {};

    const data: any = {
      overall: {
        score: stats.score ?? 0,
        coins: stats.coins ?? 0,
        games_played: stats.games_played ?? 0,
        wins: stats.wins ?? 0,
        votes: stats.total_votes ?? 0
      },
      guess: {
        wins: stats.wins_guess_the_build ?? 0,
        correct_guesses: stats.correct_guesses ?? 0
      },
      solo_normal: {
        wins: stats.wins_solo_normal ?? 0
      },
      teams_normal: {
        wins: stats.wins_teams_normal ?? 0
      },
      pro: {
        wins: stats.wins_solo_pro ?? 0
      }
    };

    data.overall.win_rate =
      this.client.util.divide(data.overall.wins, data.overall.games_played) *
      100;

    return data;
  }

  public formatUHC(player: Player): UHCData {
    const stats = player.stats?.UHC ?? {};

    const data: any = {
      solo: {
        wins: stats.wins_solo ?? 0,
        kills: stats.kills_solo ?? 0,
        deaths: stats.deaths_solo ?? 0,
        heads: stats.heads_eaten_solo ?? 0
      },
      team: {
        wins: stats.wins ?? 0,
        kills: stats.kills ?? 0,
        deaths: stats.deaths ?? 0,
        heads: stats.heads_eaten ?? 0
      },
      three_team: {
        wins: stats.wins2 ?? 0,
        kills: stats.kills2 ?? 0,
        deaths: stats.deaths2 ?? 0,
        heads: stats.heads_eaten2 ?? 0
      },
      solo_brawl: {
        wins: stats['wins_solo brawl'] ?? 0,
        kills: stats['kills_solo brawl'] ?? 0,
        deaths: stats['deaths_solo brawl'] ?? 0,
        heads: stats['heads_eaten_solo brawl'] ?? 0
      }
    };

    data.overall = {
      coins: stats.coins ?? 0,
      score: stats.score ?? 0,
      wins: player.achievements?.uhc_champion ?? 0,
      kills: player.achievements?.uhc_hunter ?? 0,
      deaths:
        data.solo.deaths +
        data.team.deaths +
        data.solo_brawl.deaths +
        data.three_team.deaths,
      heads:
        data.solo.heads +
        data.team.heads +
        data.solo_brawl.heads +
        data.three_team.heads
    };

    data.overall.kill_death_ratio = this.client.util.divide(
      data.overall.kills,
      data.overall.deaths
    );
    data.solo.kill_death_ratio = this.client.util.divide(
      data.solo.kills,
      data.solo.deaths
    );
    data.team.kill_death_ratio = this.client.util.divide(
      data.team.kills,
      data.team.deaths
    );
    data.three_team.kill_death_ratio = this.client.util.divide(
      data.three_team.kills,
      data.three_team.deaths
    );
    data.solo_brawl.kill_death_ratio = this.client.util.divide(
      data.solo_brawl.kills,
      data.solo_brawl.deaths
    );

    return data;
  }

  public formatSpeedUHC(player: Player): SpeedUHCData {
    const stats = player.stats?.SpeedUHC ?? {};

    const data: any = {
      overall: {
        wins: stats.wins ?? 0,
        losses: stats.losses ?? 0,
        kills: stats.kills ?? 0,
        deaths: stats.deaths ?? 0,
        coins: stats.coins ?? 0,
        salt: stats.salt ?? 0
      },
      solo: {
        wins: stats.wins_solo ?? 0,
        losses: stats.losses_solo ?? 0,
        kills: stats.kills_solo ?? 0,
        deaths: stats.deaths_solo ?? 0
      },
      team: {
        wins: stats.wins_team ?? 0,
        losses: stats.losses_team ?? 0,
        kills: stats.kills_team ?? 0,
        deaths: stats.deaths_team ?? 0
      },
      solo_insane: {
        wins: stats.wins_solo_insane ?? 0,
        losses: stats.losses_solo_insane ?? 0,
        kills: stats.kills_solo_insane ?? 0,
        deaths: stats.deaths_solo_insane ?? 0
      },
      team_insane: {
        wins: stats.wins_team_insane ?? 0,
        losses: stats.losses_team_insane ?? 0,
        kills: stats.kills_team_insane ?? 0,
        deaths: stats.deaths_team_insane ?? 0
      }
    };

    data.overall.kill_death_ratio = this.client.util.divide(
      data.overall.kills,
      data.overall.deaths
    );
    data.overall.win_loss_ratio = this.client.util.divide(
      data.overall.wins,
      data.overall.losses
    );

    data.solo.kill_death_ratio = this.client.util.divide(
      data.solo.kills,
      data.solo.deaths
    );
    data.solo.win_loss_ratio = this.client.util.divide(
      data.solo.wins,
      data.solo.losses
    );

    data.team.kill_death_ratio = this.client.util.divide(
      data.team.kills,
      data.team.deaths
    );
    data.team.win_loss_ratio = this.client.util.divide(
      data.team.wins,
      data.team.losses
    );

    data.solo_insane.kill_death_ratio = this.client.util.divide(
      data.solo_insane.kills,
      data.solo_insane.deaths
    );
    data.solo_insane.win_loss_ratio = this.client.util.divide(
      data.solo_insane.wins,
      data.solo_insane.losses
    );

    data.team_insane.kill_death_ratio = this.client.util.divide(
      data.team_insane.kills,
      data.team_insane.deaths
    );
    data.team_insane.win_loss_ratio = this.client.util.divide(
      data.team_insane.wins,
      data.team_insane.losses
    );

    return data;
  }
}
