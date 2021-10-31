import type { Guild } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions } from '../../../typings';

export default class Lookup extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelGuild(author.id, { byMember: true }, a),
        "You did not provide a valid guild member, or you don't have a linked account.\n\n**TIP**: To link an account, use `{prefix}link <username>`.",
        { overwrite: true, remaining: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the a guild from a player name';
  }

  public async run(
    _: Message,
    guild: Guild
  ): Promise<MessageOptions | string | null> {
    return this.client.commands
      .get('text')!
      .children.get('guild')!
      .run(_, guild);
  }
}
