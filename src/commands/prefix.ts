import { Util } from 'discord.js-light';
import type { Guild } from 'discord.js-light';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Prefix extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.owner = true;
    this.arguments = [
      new Argument(
        'prefix',
        'The new prefix',
        (a: string) => a.length <= 16 && a.toLowerCase(),
        'You must provide a prefix of no more than 16 characters.',
        {
          overwrite: true,
          optional: true
        }
      )
    ];

    this.description = 'Changes the prefix for StatPixel';
  }

  public async run(
    { guild }: Message & { guild: Guild },
    prefix: string = this.client.config.defaultConfiguration.prefix
  ): Promise<MessageOptions | string | null> {
    await this.client.setSetting(guild.id, 'prefix', prefix);

    return `The prefix for **${Util.escapeMarkdown(
      guild.name
    )}** has been changed to \`\`${prefix}\`\`.`;
  }
}
