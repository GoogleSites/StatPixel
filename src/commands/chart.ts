import type { Guild } from 'discord.js-light';

import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Chart extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('charts', 'togglechart', 'togglecharts');
    this.owner = true;

    this.description = 'Toggles on and off displaying charts';
  }

  public async run({
    guild,
    _settings
  }: Message & { guild: Guild }): Promise<MessageOptions | string | null> {
    await this.client.setSetting(guild.id, 'chart', !_settings.chart);

    return `General charts have been **${
      _settings.chart ? 'disabled' : 'enabled'
    }**.`;
  }
}
