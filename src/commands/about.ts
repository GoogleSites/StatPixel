import axios from 'axios';
import { version } from 'discord.js-light';

import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class About extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.description = 'General overview of StatPixel';
  }

  public async run({
    guild
  }: Message): Promise<MessageOptions | string | null> {
    const [profiles, guilds, status] = await Promise.all([
      this.client.database.users.countDocuments(),
      this.client.shard!.broadcastEval(client => client.guilds.cache.size),
      axios
        .get('https://status.hypixel.net/api/v2/status.json')
        .then(d => d.data.status)
        .catch(() => ({ indicator: 'error', description: 'Error' }))
    ]);

    const guildCount = guilds.reduce((a, b) => a + b, 0);

    return {
      embed: {
        title: `StatPixel โฎ Shard #${guild === null ? '0' : guild.shardId}`,
        fields: [
          {
            name: 'Memory Usage ๐งต',
            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
              2
            )} MB`,
            inline: true
          },
          {
            name: 'Uptime โ',
            value: this.client.util.formatTime(this.client.uptime! / 1000),
            inline: true
          },
          {
            name: 'Discord.js Version ๐ฆ',
            value: `v${version}`,
            inline: true
          },
          {
            name: 'Statistics ๐',
            value: `Guilds: **${guildCount}**\nProfiles: **${profiles}**`,
            inline: true
          },
          {
            name: 'Developers ๐ค',
            value: 'GoogleSites#7707\nJaii#0040',
            inline: true
          },
          {
            name: 'Node.js Version ๐',
            value: process.version,
            inline: true
          },
          {
            name: `Hypixel ${status.indicator === 'none' ? '๐ข' : '๐ด'}`,
            value: status.description,
            inline: true
          }
        ]
      }
    };
  }
}
