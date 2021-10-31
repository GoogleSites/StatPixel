import type { TextChannel } from 'discord.js-light';
import { inPlaceSort } from 'fast-sort';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Friends extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('friends', 'friendslist');
    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.getConnectedUUID(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the friends list of a player';
  }

  public async run(
    { author, channel, id }: Message,
    uuid: string
  ): Promise<MessageOptions | string | null> {
    const [{ friends, count }, username] = await Promise.all([
      this.client.hypixel.friends(uuid).then(async friends => {
        return {
          count: friends.length,
          friends: await Promise.all(
            friends.slice(0, 100).map(async f => ({
              name: await this.client.hypixel.getUsername(
                f[f.uuidReceiver === uuid ? 'uuidSender' : 'uuidReceiver']
              ),
              value: `<t:${Math.floor(f.started / 1000)}:R>`,
              started: f.started,
              inline: true
            }))
          )
        };
      }),
      this.client.hypixel.getUsername(uuid)
    ]);

    inPlaceSort(friends).desc(f => f.started);

    this.client.util.scroller(channel as TextChannel, author, {
      reply: id,
      title: 'Friends',
      description: `${username} has **${count}** friend${
        count === 1 ? '' : 's'
      }.${
        count > 100
          ? ` They have too many to show, so you'll only see the first **100**.`
          : ''
      }`,
      fields: friends
    });

    return null;
  }
}
