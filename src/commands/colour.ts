import { Guild, Util } from 'discord.js-light';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

const HEX_COLOUR_REGEX = /^#(?:[a-fA-F0-9]{3}){1,2}$/;

export default class Colour extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.owner = true;
    this.aliases.push('color');
    this.arguments = [
      new Argument(
        'colour',
        'The new hex colour (#FFFFFF)',
        (a: string) => HEX_COLOUR_REGEX.test(a),
        'You must provide a hex colour code.',
        { optional: true }
      )
    ];

    this.description = 'Changes the colour of StatPixel embeds';
  }

  public async run(
    { guild }: Message & { guild: Guild },
    colour: string = this.client.config.defaultConfiguration.colour
  ): Promise<MessageOptions | string | null> {
    await this.client.setSetting(guild.id, 'colour', colour);

    return `The colour for **${Util.escapeMarkdown(
      guild.name
    )}** has been changed to \`\`${colour}\`\`.`;
  }
}
