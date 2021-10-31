import { ObjectId } from 'mongodb';

import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions, User } from '../../typings';

export default class Create extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('new');
    this.description = 'Creates a new session';
  }

  public async run({
    author,
    _settings
  }: Message): Promise<MessageOptions | string | null> {
    const user: User | null = await this.client.database.users.findOne({
      discord_id: author.id
    });

    if (user === null || user.uuid === undefined)
      throw `You must have a linked account in order to create a new session.\n\n**TIP**: Link yourself with \`${_settings.prefix}link\`.`;

    const id = new ObjectId();
    const player = await this.client.hypixel.player(user.uuid);
    const session = await this.client.profile.createSession(player, id);

    await this.client.database.users.updateOne(
      {
        _id: user._id
      },
      {
        $push: {
          sessions: session
        },
        $set: {
          active_session: user.sessions.length
        }
      }
    );

    return {
      embed: {
        title: 'Session Created',
        description: `Session **#${user.sessions.length + 1}** is now active.
\`-\` To switch between sessions, use \`${
          _settings.prefix
        }session use <number>\`
\`-\` To view all of your sessions, use \`${_settings.prefix}sessions\``
      }
    };
  }
}
