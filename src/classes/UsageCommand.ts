import BaseCommand from './BaseCommand';
import type Main from './Main';

export default class UsageCommand extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);
  }

  public async run() {
    return {
      embed: {
        title: 'Error',
        fields: [
          {
            name: 'Subcommands',
            value: this.children.map(c => `\`${c.name}\``).join(', ') || 'None',
            inline: this.children.size < 7
          }
        ]
      }
    };
  }
}
