import { ObjectId } from 'mongodb';

import type { Settings } from './typings';

export default {
  token: 'REDACTED',
  database: {
    uri: 'REDACTED',
    name: 'REDACTED'
  },
  history_snapshot_window: 500,
  guild: 'REDACTED' as `${bigint}`,
  admins: ['REDACTED', 'REDACTED'],
  embed: {
    color: '#006dff',
    timestamp: true,
    footer: {
      text: 'StatPixel 2.0',
      icon_url: 'https://i.imgur.com/D8F5bWG.png'
    }
  },
  keys: ['REDACTED'],
  history_keys: ['REDACTED'],
  messages: {
    invalid_username_or_uuid:
      'You did not provide a valid username or UUID, or you do not have a linked account.\n\n**TIP**: To link an account, use `{prefix}link <username>`.'
  },
  static: new ObjectId('REDACTED'),
  textGamemodes: new Set(),
  imageGamemodes: new Set(),
  defaultConfiguration: {
    prefix: '-',
    text: false,
    colour: '#006dff',
    chart: false
  } as Settings,
  channels: {
    bug_reports: 'REDACTED' as `${bigint}`,
    guild_join: 'REDACTED' as `${bigint}`
  },
  default_history_keys: [
    'stats,Bedwars,Experience',
    'stats,Bedwars,final_kills_bedwars',
    'stats,Bedwars,final_deaths_bedwars',
    'stats,Bedwars,beds_broken_bedwars',
    'stats,Bedwars,losses_bedwars',
    'stats,Bedwars,wins_bedwars'
  ].reduce(
    (a: { [key: string]: [number, number][] }, b) => (a[b] = []) && a,
    {}
  )
};
