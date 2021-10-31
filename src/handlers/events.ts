import type { Guild, GuildMember, TextChannel } from 'discord.js-light';

import Handler from '../classes/Handler';
import type Main from '../classes/Main';

const formatter = new Intl.NumberFormat();

export default class Ready extends Handler {
  private channel: TextChannel;

  constructor(client: Main) {
    super(client);

    this.channel = this.client.guilds
      .forge(this.client.config.guild)
      .channels.forge(this.client.config.channels.guild_join, 'GUILD_TEXT');
  }

  public async init() {}

  public async guildMemberRemove(member: GuildMember) {
    return this.client.database.commands.deleteMany({
      discord_id: member.id,
      guild_id: member.guild.id
    });
  }

  public async guildCreate(guild: Guild) {
    const total = (
      await this.client.shard!.broadcastEval(client => client.guilds.cache.size)
    ).reduce((a, b) => a + b, 0);

    const owner = await this.client.users.fetch(guild.ownerId);

    this.client.util.message(this.channel, {
      embed: {
        author: {
          name: guild.name,
          icon_url: guild.iconURL({ dynamic: true }) ?? undefined
        },
        description: `👪 Members: \`${formatter.format(guild.memberCount)}\`
👑 Owner: \`${owner.tag}\`

📊 Total: **${formatter.format(total)}** guilds`
      }
    });
  }
}
