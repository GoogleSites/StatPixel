import type { Guild } from 'discord.js-light';

import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Display extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push(
      'displays',
      'toggledisplay',
      'toggledisplays',
      'text',
      'toggletext',
      'embed',
      'toggleembed'
    );
    this.owner = true;

    this.description = 'Toggles between image and text statistics';
  }

  public async run({
    guild,
    _settings
  }: Message & { guild: Guild }): Promise<MessageOptions | string | null> {
    await this.client.setSetting(guild.id, 'text', !_settings.text);

    return `Text statistics have been **${
      _settings.text ? 'disabled' : 'enabled'
    }**.`;
  }
}
