import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type { Message, MessageOptions, User } from '../../typings';

export default class Use extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('switch');
    this.arguments = [
      new Argument(
        'session',
        'The number of the session to switch to.',
        Argument.isPositiveInteger,
        'You must provide a session number to switch to.\n\n**EXAMPLE**: `{prefix}session use 1`',
        { overwrite: true }
      )
    ];

    this.description = 'Switches the active session';
  }

  public async run(
    { author, _settings }: Message,
    index: number
  ): Promise<MessageOptions | string | null> {
    const user: User | null = await this.client.database.users.findOne({
      discord_id: author.id
    });

    if (user === null || user.uuid === undefined)
      throw `You must have a linked account in order to switch to a session.\n\n**TIP**: Link yourself with \`${_settings.prefix}link\`.`;

    if (index > user.sessions.length)
      throw `You only have ${user.sessions.length} sessions, so you can't switch to \`#${index}\`.`;

    if (index - 1 === user.active_session)
      throw `Session \`#${index}\` is already active. You're good to go!`;

    await this.client.database.users.updateOne(
      {
        _id: user._id
      },
      {
        $set: {
          active_session: index - 1
        }
      }
    );

    return {
      embed: {
        title: 'Session Switched',
        description: `You have switched to session \`#${index}\`, created <t:${Math.floor(
          user.sessions[index - 1].created_at / 1000
        )}:R>.`
      }
    };
  }
}
