import type { Player } from 'hypixel-api-v2';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Monthly extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('s', 'ses');
    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelProfile(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      )
    ];

    this.description =
      'Retrieves the daily BedWars session statistics of a player';
  }

  public async run(
    message: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    return this.children.get('bedwars')!.run(message, player);
  }
}
