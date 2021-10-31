import type { TextChannel } from 'discord.js-light';

import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Update extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.admin = true;
    this.description = 'Restarts all shards gracefully';
  }

  public async run({
    channel
  }: Message): Promise<MessageOptions | string | null> {
    await this.client.util.message(channel as TextChannel, {
      embed: {
        description: `Restarting **${this.client.shard!.count}** shards...`
      }
    });

    await this.client.shard!.respawnAll();

    return null;
  }
}
