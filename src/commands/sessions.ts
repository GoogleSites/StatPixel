import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions, User } from '../typings';

export default class Sessions extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('new');
  }

  public async run({
    author,
    _settings
  }: Message): Promise<MessageOptions | string | null> {
    const user: User | null = await this.client.database.users.findOne({
      discord_id: author.id
    });

    if (user === null || user.uuid === undefined)
      throw `You don't have any sessions.\n\n**TIP**: Link yourself with \`${_settings.prefix}link\`.`;

    const player = await this.client.hypixel.player(user.uuid);

    return {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(
            player
          )} ➢ Murder Mystery`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        description: `${user.sessions
          .map(
            (s, i) =>
              `\`#${i + 1}\` was created <t:${Math.floor(
                s.created_at / 1000
              )}:R>`
          )
          .join('\n')}

Use \`${_settings.prefix}session use <number>\` to switch to a session.`
      }
    };
  }
}
