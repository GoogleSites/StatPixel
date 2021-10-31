import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Help extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.description = 'Useful commands and general overview of StatPixel';
  }

  public async run({
    _settings,
    author,
    guild
  }: Message): Promise<MessageOptions | string | null> {
    return {
      embed: {
        title: 'StatPixel Help 🗞️',
        thumbnail: {
          url:
            guild !== null
              ? guild.iconURL({ dynamic: true }) ?? undefined
              : author.displayAvatarURL({ dynamic: true })
        },
        fields: [
          {
            name: 'Commands 🤖',
            value: 'This section is coming soon... 🚧🏗️'
          },
          {
            name: 'Server Settings ⚙️',
            value: `Prefix: \`${_settings.prefix}\` or ${this.client.user!}
Embed colour: \`${_settings.colour}\`
Use text: ${_settings.text ? '🟢' : '🔴'}`
          }
        ],
        description: `*You can use \`${_settings.prefix}guide\` start for the bot to message you a guide on how to get started with using the bot.*`
      }
    };
  }
}
