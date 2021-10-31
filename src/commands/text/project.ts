import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions } from '../../typings';

export default class Project extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('projection', 'proj');
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
      'Projects BedWars statistics of a player at their next prestige';
  }

  public async run(
    _: Message,
    player: Player
  ): Promise<MessageOptions | string | null> {
    return this.children.get('bedwars')!.run(_, player);
  }
}
