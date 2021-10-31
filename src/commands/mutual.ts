import type { EmbedFieldData, TextChannel } from 'discord.js-light';
import { Util } from 'discord.js-light';
import { inPlaceSort } from 'fast-sort';

import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';

export default class Mutual extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('mutuals');
    this.arguments = [
      new Argument(
        'usernames',
        'A list of space-separated usernames',
        async (a: string[], { author }: Message) => {
          const others = await Promise.all(
            a.map(username =>
              this.client.util.getConnectedUUID(author.id, username, false)
            )
          );

          if (others.length === 1)
            others.push(await this.client.util.getConnectedUUID(author.id));

          return [...new Set(others)];
        },
        'You must provide at least 2 usernames to compare, or 1 if you have a linked account.',
        { overwrite: true, remaining: true, array: true }
      )
    ];

    this.description = 'Mutual friends between two or more players';
  }

  public async run(
    { author, channel, _settings, id }: Message,
    compare: string[]
  ): Promise<MessageOptions | string | null> {
    if (compare.every((c, i, a) => (i > 0 ? c !== a[0] : true)) === false)
      throw `Instead of comparing the same person twice, use \`${_settings.prefix}friends\`.`;

    const [friends, usernames] = await Promise.all([
      Promise.all(compare.map(c => this.client.hypixel.friends(c))),
      Promise.all(
        compare.map(async c =>
          Util.escapeMarkdown(await this.client.hypixel.getUsername(c))
        )
      )
    ]);

    const mutual: Promise<EmbedFieldData & { started: number }>[] = [];

    for (const list of friends.shift()!) {
      const key =
        list.uuidReceiver === compare[0] ? 'uuidSender' : 'uuidReceiver';

      if (
        friends.every((l, i) =>
          l.some(
            f =>
              f[
                f.uuidReceiver === compare[i + 1]
                  ? 'uuidSender'
                  : 'uuidReceiver'
              ] === list[key]
          )
        )
      ) {
        mutual.push(
          (async () => ({
            name: await this.client.hypixel.getUsername(list[key]),
            value: `<t:${Math.floor(list.started / 1000)}:R>`,
            started: list.started,
            inline: true
          }))()
        );
      }
    }

    const last = usernames.pop();
    const resolved = await Promise.all(mutual);

    inPlaceSort(resolved).desc(f => f.started);

    this.client.util.scroller(channel as TextChannel, author, {
      reply: id,
      title: 'Friends (Mutual)',
      description: `There ${
        mutual.length === 1
          ? 'is **1** mutual friend'
          : `are **${mutual.length}** mutual friends`
      } between ${usernames.join(', ')} and ${last}.`,
      fields: resolved
    });

    return null;
  }
}
