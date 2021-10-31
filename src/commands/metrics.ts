import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { CommandUsageEntry, Message, MessageOptions } from '../typings';

export default class Leaderboard extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('metric');
    this.description = 'Metrics on command usage';
  }

  public async run({
    author,
    channel,
    guild,
    id
  }: Message): Promise<MessageOptions | string | null> {
    const leaderboard: CommandUsageEntry[] = await this.client.database.metrics
      .find({})
      .sort({ uses: -1, key: 1 })
      .toArray();

    this.client.util.scroller(channel, author, {
      reply: id,
      fields: leaderboard.map((l, i) => ({
        name: `${i + 1}. ${l.key}`,
        value: `${l.uses} uses`,
        inline: true
      })),
      title: {
        name: 'Global Leaderboard ➢ Usage',
        icon_url:
          guild !== null
            ? guild.iconURL({ dynamic: true })
            : author.displayAvatarURL({ dynamic: true })
      }
    });

    return null;
  }
}
