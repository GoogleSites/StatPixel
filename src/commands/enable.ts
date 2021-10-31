import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Enable extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.admin = true;
    this.arguments = [
      new Argument(
        'command',
        'The command to enable',
        Argument.isPresent,
        'You must provide a command name to enable.',
        {
          remaining: true,
          array: true,
          overwrite: true
        }
      )
    ];

    this.description = 'Enables a command.';
  }

  public async run(
    _: Message,
    path: string[]
  ): Promise<MessageOptions | string | null> {
    const name = path.join(' ');
    const [, command] = this.client.find(path, true);

    if (!command) throw 'You did not provide a valid command.';

    if (command.enabled) throw `\`${name}\` is already enabled.`;

    command.enabled = true;

    await this.client.database.static.updateOne(
      {
        _id: this.client.config.static
      },
      {
        $pull: {
          disabled: name.replace(/ /g, ',')
        }
      }
    );

    return {
      embed: {
        description: `\`${name}\` has been **enabled**.`
      }
    };
  }
}
