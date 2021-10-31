'use strict';

import parser from 'cron-parser';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  CommandInteraction,
  Message,
  PartialDMChannel
} from 'discord.js-light';
import type {
  DMChannel,
  MessageOptions as DiscordMessageOptions,
  EmbedFieldData,
  MessageResolvable,
  NewsChannel,
  TextChannel,
  User
} from 'discord.js-light';
import { inPlaceSort } from 'fast-sort';
import type { Player, SkyblockProfile } from 'hypixel-api-v2';

import type Main from '../classes/Main';
import config from '../config.js';
import type { User as DatabaseUser, MessageOptions } from '../typings';
import { SKYBLOCK_PROFILE_EMOJIS } from './HypixelUtil';

export const UUID_REGEX =
  /^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/;

export const USERNAME_REGEX = /^\w{1,16}$/;

dayjs.extend(relativeTime);

const number = new Intl.NumberFormat();

export default class Util {
  private client: Main;

  /**
   * Creates a new Util instance
   * 
   * @param client The main client
   */
  constructor(client: Main) {
    this.client = client;
  }

  /**
   * Adds spacing to a string, if needed
   * 
   * @param message The string on which to add spacing
   * @returns A string with appropriate spacing
   * 
   * @example
   * ```
   * addSpacing('hello world'); // 'hello world\n\u200b'
   * ```
   */
  public addSpacing(message: string) {
    return !/\n(?:\u200b)*$/.test(message) ? `${message}\n\u200b` : message;
  }

  /**
   * Sends or edits a message
   * 
   * @param channel The target for the messages
   * @param options The message options
   * @returns The sent message
   * 
   * @example
   * ```
   * await message(channel, { message: 'hello world' });
   * ```
   */
  public async message(
    channel:
      | Message
      | TextChannel
      | NewsChannel
      | DMChannel
      | User
      | PartialDMChannel
      | CommandInteraction,
    { message, embed, files = [], reply }: MessageOptions
  ): Promise<Message> {
    const payload: DiscordMessageOptions = {
      files,
      content: message
    };

    if (reply)
      payload.reply = {
        messageReference: reply
      };

    if (embed) {
      payload.embeds = [
        {
          ...config.embed,
          // @ts-ignore
          color: channel.guild
            ? // @ts-ignore
              (await this.client.fetchSettings(channel.guild.id)).colour
            : // @ts-ignore
              channel.embeds?.[0]?.color ?? config.embed.color,
          timestamp: config.embed.timestamp ? Date.now() : undefined,
          ...embed
        }
      ];

      if (embed.fields?.length! > 0)
        payload.embeds[0].fields = payload.embeds[0].fields?.map(f => ({
          name: f.name,
          value: this.addSpacing(f.value),
          inline: f.inline
        }));

      if (embed.description)
        payload.embeds[0].description = this.addSpacing(
          payload.embeds[0].description!
        );
    }

    if (channel instanceof Message) return channel.edit(payload);

    if (channel instanceof CommandInteraction) {
      payload.reply = undefined;

      const message = await channel.editReply(payload);

      if (message instanceof Message) return message;

      return channel.channel!.messages.forge(message.id);
    }

    return channel.send(payload);
  }

  /**
   * Returns a Promise that resolves with a truthy value
   * 
   * @param ms The number of milliseconds to wait for
   * @returns Always returns true
   * 
   * @example
   * ```
   * await sleep(5000); // sleeps for 5 seconds
   * ```
   */
  public sleep(ms: number): Promise<true> {
    return new Promise(r => setTimeout(r, ms, true));
  }

  /**
   * Formats the difference between two numbers
   * 
   * @param one The first number
   * @param two The second number
   * @param round The number of digits to keep after the decimal, 0 to return an integer
   * @param percentage Whether the number is a percentage
   * @returns A formatted number difference
   * 
   * @example
   * ```
   * formatDifference(15, 50); // '15 `-35`'
   * ```
   */
  public formatDifference(
    one: number,
    two: number,
    round = 2,
    percentage = false
  ) {
    const difference = Math.abs(one - two);

    return `${this.formatNumber(one, round)}${percentage ? '%' : ''} \`${
      one >= two ? '+' : '-'
    }${this.formatNumber(difference, round)}${percentage ? '%' : ''}\``;
  }

  /**
   * Rounds a number
   * 
   * @param n The number to round
   * @param places The number of decimal places to keep, 0 for an integer
   * @returns A rounded number
   */
  public round(n: number, places = 2) {
    return places === 0 ? Math.round(n)
      : Math.floor(n * 10 ** places) / 10 ** places;
  }

  /**
   * Formats a number into a human-readable format
   * 
   * @param n The number to format
   * @param round The number of decimal places to keep, 0 for an integer
   * @returns A formatted number
   * 
   * @example
   * ```
   * formatNumber(1250000, 2); // '1.25M';
   * ```
   */
  public formatNumber(n: number, round = 2) {
    if (typeof n !== 'number') return 'Not enough data';

    return n < 100000
      ? number.format(this.round(n, round))
      : n < 1000000
      ? `${this.round(n / 1000, round)}K`
      : n < 1000000000
      ? `${this.round(n / 1000000, round)}M`
      : `${this.round(n / 1000000000, round)}B`;
  }

  /**
   * Takes random elements from an array with no duplicates
   * 
   * @param array The array to retrieve results from
   * @param count The number of elements to take
   * @returns An random array of elements from the source array
   * 
   * @comment Taken from https://stackoverflow.com/a/19270021
   * 
   * @example
   * ```
   * randomArray([1, 2, 3, 4, 5], 2); // [5, 2] (or something similar)
   * ```
   */
  public randomArray(array: any[], count: number = 1): any[] {
    let len = array.length;
    const result = new Array(count),
      taken = new Array(len);

    if (count > len)
      throw new RangeError('randomArray: more elements taken than available');

    while (count--) {
      const x = Math.floor(Math.random() * len);

      result[count] = array[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }

    return result;
  }

  /**
   * Generates a random integer
   * 
   * @param max The upper limit for the random number, inclusive
   * @param min The lower limit for the random number, inclusive
   * @returns A random integer between `min` and `max`, 
   * 
   * @example
   * ```
   * random(15, 10); // 11 (or something similar)
   * ```
   */
  public random(max: number, min: number = 0) {
    return Math.round(Math.random() * (max - min + 1) + min);
  }

  /**
   * Averages out an array of numbers
   * 
   * @param numbers An array of numbers or objects of which to average
   * @param key The key that points to the value in the object
   * @returns The average of the numbers
   * 
   * @example
   * ```
   * average([10, 20]); // 15
   * average([{ n: 5 }, { n: 10 }, { n: 7.5 }], 'n'); // 7.5
   * ```
   */
  public average(numbers: any[], key?: string): number {
    return (
      (key
        ? numbers.reduce((a, b) => a + b[key], 0)
        : numbers.reduce((a, b) => a + b, 0)) / numbers.length
    );
  }

  /**
   * Calculates the median, dividing the two middle numbers if it's even in length
   * 
   * @param numbers An array of numbers of which to calculate the median
   * @returns The median
   * 
   * @example
   * ```
   * median([1, 50, 1000]); // 50
   * median([1, 50, 100, 1000]); // 75
   * ```
   */
  public median(numbers: number[]) {
    if (numbers.length % 2 === 1) return numbers[numbers.length / 2 - 0.5];

    return Math.round(
      (numbers[numbers.length / 2 - 1] + numbers[numbers.length / 2]) / 2
    );
  }

  /**
   * Returns the highest number in the array
   * 
   * @param numbers The array of numbers or objects
   * @param key The key that points to the number in an object
   * @returns The highest number, -Infinity if the array has no length
   * 
   * @example
   * ```
   * maximum([10, 50, 30, 100, 12, 19]); // 100 (same as Math.max)
   * maximum([{ n: 50 }, { n: 15 }, { n: 40 }], 'n'); // 50
   * ```
   */
  public maximum(numbers: any[], key: string) {
    let maximum = -Infinity;

    for (const value of numbers) {
      if (value[key] > maximum) maximum = value[key];
    }

    return maximum;
  }

  /**
   * Returns the lowest number in the array
   * 
   * @param numbers The array of numbers or objects
   * @param key The key that points to the number in an object
   * @returns The lowest number, Infinity if the array has no length
   * 
   * @example
   * ```
   * maximum([10, 50, 30, 100, 12, 19]); // 10 (same as Math.min)
   * maximum([{ n: 50 }, { n: 15 }, { n: 40 }], 'n'); // 15
   * ```
   */
  public minimum(numbers: any[], key: string) {
    let minimum = Infinity;

    for (const value of numbers) {
      if (value[key] < minimum) minimum = value[key];
    }

    return minimum;
  }

  /**
   * Returns the most common number or boolean in an array
   * 
   * @param numbers An array of numbers or booleans
   * @param type The most common value
   * 
   * @example
   * ```
   * mode([1, 2, 3, 1], 'number'); // 1
   * mode([false, true, false, false], 'boolean'); // false
   * ```
   */
  public mode(numbers: number[], type?: 'number'): number;
  public mode(numbers: boolean[], type: 'boolean'): boolean;
  public mode(
    numbers: number[] | boolean[],
    type: 'boolean' | 'number' = 'number'
  ) {
    if (numbers.length === 0) return type === 'boolean' ? false : 0;

    if (typeof numbers[0] === 'number') {
      const { key } = (numbers as number[]).reduce(
        (a, b) => {
          if (a.all[b]) ++a.all[b];
          else a.all[b] = 1;

          if (a.key !== b && a.all[b] > a.count) {
            a.key = b;
            a.count = a.all[b];
          }

          return a;
        },
        {
          key: null,
          count: 0,
          all: {}
        } as {
          key: number | null;
          count: number;
          all: { [key: number]: number };
        }
      );

      return key!;
    }

    const { key } = (numbers as boolean[]).reduce(
      (a, b) => {
        const n = b ? 1 : 0;

        if (a.all[n]) ++a.all[n];
        else a.all[n] = 1;

        if (a.key !== n && a.all[n] > a.count) {
          a.key = n;
          a.count = a.all[n];
        }

        return a;
      },
      {
        key: null,
        count: 0,
        all: {}
      } as {
        key: number | null;
        count: number;
        all: { [key: number]: number };
      }
    );

    return key ? true : false;
  }

  /**
   * Divides a number, making the denominator 1 if 0
   * 
   * @param one The nominator
   * @param two The denominator
   * @returns The divided number
   * 
   * @example
   * ```
   * divide(1, 0); // 1
   * divide(5, 10); // 0.5
   * ```
   */
  public divide(one = 0, two = 1) {
    return one / (two || 1);
  }

  /**
   * Returns the sum of all numbers in an array
   * 
   * @param numbers An array of numbers or objects
   * @param key The key that points to the number in the object
   * @returns The sum of all numbers in the array
   * 
   * @example
   * ```
   * sum([1, 2, 3]); // 6
   * sum([{ n: 5 }, { n: 10 }], 'n'); // 15
   * ```
   */
  public sum(numbers: any[], key?: string): number {
    return key
      ? numbers.reduce((a, b) => a + b[key], 0)
      : numbers.reduce((a, b) => a + b, 0);
  }

  /**
   * Normalizes an array of numbers between 0 and 100 in-place
   * 
   * @param array An array of numbers
   * @returns The normalized array
   * 
   * @example
   * ```
   * normalize([1, 2, 3, 5]); // [0, 25, 50, 100]
   * ```
   */
  public normalize(array: number[]) {
    const max = Math.max(...array);
    const min = Math.min(...array);

    for (let i = 0; i < array.length; ++i) {
      array[i] = ((array[i] - min) / (max - min)) * 100;
    }

    return array;
  }

  /**
   * Returns the average proximity of the numbers to the total average of all numbers in the array
   * 
   * @param numbers An array of numbers or objects
   * @param key The key that points to the number in the object
   * @returns The average proximity
   * 
   * @example
   * ```
   * proximity([50, 75, 150]); // 50
   * ```
   */
  public proximity(numbers: any[], key?: string): number {
    const average = this.average(numbers, key);

    return (
      (key
        ? numbers.reduce((a, b) => a + Math.abs(average - b[key]), 0)
        : numbers.reduce((a, b) => a + Math.abs(average - b), 0)) /
      numbers.length
    );
  }

  /**
   * Waits for a reaction and returns the index of the emoji
   * 
   * @param message The message on which to await a reaction
   * @param user The user that requires input
   * @param emojis The emoji filter
   * @returns The index of the emoji reacted, -1 if none
   * 
   * @example
   * ```
   * await awaitReaction(message, user, ['🍪']); // 0
   * ```
   */
  public async awaitReactionIndex(
    message: Message,
    user: User,
    emojis: string[],
    remove = true
  ) {
    const reactions = await message.awaitReactions({
      filter: (r, u) => user.id === u.id && emojis.includes(r.emoji.name!),
      max: 1,
      time: 60000
    });

    const first = reactions.first();

    if (first === undefined) return -1;

    if (remove)
      await first.users.remove(user);

    return emojis.indexOf(first.emoji.name!);
  }

  /**
   * Formats seconds into days, hours, minutes, and (optionally) seconds
   * 
   * @param seconds The number of seconds to format
   * @param withSeconds `true` if seconds should be included in the formatted result, `false` if not
   * @returns A formatted time
   * 
   * @example
   * ```
   * formatTime(86400, true); // '1d 0h 0m 0s'
   * formatTime(86400, false); // '1d 0h 0m'
   * ```
   */
  public formatTime(seconds: number, withSeconds = true) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor(((seconds % 86400) % 3600) / 60);

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m${
      withSeconds ? ` ${Math.floor(((seconds % 86400) % 3600) % 60)}s` : ''
    }`;
  }

  /**
   * Capitalizes characters that follow an underscore, or are at the start of the string
   * 
   * @param string The string to format
   * @returns The formatted string
   * 
   * @example
   * ```
   * formatString('hello_world'); // 'Hello World'
   * ```
   */
  public formatString(string: string) {
    return string.replace(/(?:(?<=_)|^)(\w)/g, m => m.toUpperCase());
  }

  /**
   * Formats a UNIX timestamp
   * 
   * @param timestamp The UNIX timestamp (with milliseconds) to format
   * @returns A formatted timestamp
   * 
   * @example
   * ```
   * formatDate(1627254567643); // 'Sunday, July 25, 2021 at 11:09 PM (UTC)'
   * ```
   */
  public formatDate(timestamp: number) {
    return dayjs
      .unix(timestamp)
      .utc()
      .format('dddd, MMMM D, YYYY [at] h:mm A [(UTC)]');
  }

  /**
   * Runs a function until it returns a desired result
   * 
   * @param fn The function to repeat
   * @param args The arguments to pass to the function
   * @param validate The function that the result of `fn` should pass before being declared valid
   * @param limit the maximum number of times to run `fn`
   * @param time The amount of time to wait between each call to `fn`
   * @returns `value` is undefined if no result is found, otherwise it's the result of `fn`
   * 
   * @example
   * ```
   * repeatLimitAndTime(
   *   sleep,
   *   [5000],
   *   v => v === true,
   *   1000
   * ); // { success: true, value: true }
   * ```
   */
  public async repeatLimitAndTime(
    fn: Function,
    args: any[],
    validate: Function,
    limit: number = 5,
    time: number = 1000
  ): Promise<{ success: boolean; value: any }> {
    while (limit--) {
      const result = await fn(...args);

      if (validate(result)) return { success: true, value: result };
      else if (limit === 0) return { success: false, value: result };

      await this.sleep(time);
    }

    return { success: false, value: undefined };
  }

  /**
   * Returns the connected UUIO of a user
   * 
   * @param discord_id The user Snowflake provided by Discord
   * @param query A username or UUID of a Minecraft account
   * @param allowFallback Whether to use the linked account provided by `discord_id` if an account isn't found with `query`
   * @returns The connected UUID
   * 
   * @example
   * ```
   * await getConnectedUUID('314566854376947725', 'GoogleSites'); // '2320b86eea7c4d7ca75630ae86281d78'
   * ```
   */
  public async getConnectedUUID(
    discord_id: string,
    query?: string,
    allowFallback = true
  ) {
    if (query !== undefined) return this.client.hypixel.getUUID(query);

    if (allowFallback === false) throw 'Profile not found.';

    const data: DatabaseUser | null = await this.client.database.users.findOne({
      discord_id
    });

    if (data === null) throw 'Profile not found.';

    return data.uuid;
  }

  /**
   * Queries the user to select a SkyBlock profile
   * 
   * @param user A User to accept input from
   * @param channel The Channel to senc the request in
   * @param profiles An array of SkyBlock profiles to choose from
   * @param player The player retrieved from `hypixel-api-v2`'s `player` method
   * @returns The selected profile, or null if none was selected
   * 
   * @example
   * ```
   * selectSkyblockProfile(user, channel, profiles, player); // null (user didn't select a profile)
   * ```
   */
  public async selectSkyblockProfile(
    user: User,
    channel:
      | TextChannel
      | NewsChannel
      | DMChannel
      | PartialDMChannel
      | CommandInteraction,
    profiles: SkyblockProfile[],
    player: Player
  ) {
    inPlaceSort(profiles).desc(p => p.members[player.uuid].last_save);

    const emojis = profiles.map(p => SKYBLOCK_PROFILE_EMOJIS[p.cute_name]);
    const message = await this.message(channel, {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(
            player
          )} ➢ SkyBlock Profile Selection`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        description: profiles
          .map(
            (p, i) =>
              `${emojis[i]} ➤ **${p.cute_name}** (played <t:${Math.floor(
                p.members[player.uuid].last_save / 1000
              )}:R>)`
          )
          .join('\n\n')
      }
    });

    for (const emoji of emojis) {
      await message.react(emoji);
    }

    const index = await this.awaitReactionIndex(message, user, emojis);

    if (channel.type !== 'DM') message.reactions.removeAll();

    return index === -1 ? null : profiles[index];
  }

  /**
   * Retrieves connected SkyBlock profiles of a user
   * 
   * @param discord_id The user Snowflake provided by Discord
   * @param query A username or UUID of a Minecraft account
   * @param allowFallback Whether to use the linked account provided by `discord_id` if an account isn't found with `query`
   * @returns The connected SkyBlock profiles
   */
  public async fetchSkyblockProfiles(
    discord_id: string,
    query?: string,
    allowFallback = true
  ) {
    const uuid =
      query === undefined
        ? allowFallback
          ? await this.getConnectedUUID(discord_id)
          : undefined
        : UUID_REGEX.test(query)
        ? query.replace(/-/g, '')
        : await this.client.hypixel.getUUID(query);

    if (!uuid) throw 'Profile not found.';

    return {
      profiles: await this.client.hypixel.skyblock_profiles(uuid),
      uuid
    };
  }

  /**
   * Retrieves the linked Hypixel player of a user
   * 
   * @param discord_id The user Snowflake provided by Discord
   * @param query A username or UUID of a Minecraft account
   * @param allowFallback Whether to use the linked account provided by `discord_id` if an account isn't found with `query`
   * @returns A Player from `hypixel-api-v2`
   */
  public async fetchHypixelProfile(
    discord_id: string,
    query?: string,
    allowFallback = true
  ) {
    const uuid =
      query === undefined
        ? allowFallback
          ? await this.getConnectedUUID(discord_id)
          : undefined
        : UUID_REGEX.test(query)
        ? query.replace(/-/g, '')
        : await this.client.hypixel.getUUID(query);

    if (!uuid) throw 'Profile not found.';

    return this.client.hypixel.player(uuid);
  }

  /**
   * Formats a number to include an ordinal suffix
   * 
   * @param n The number to format
   * @returns The formatted number
   * 
   * @comment Taken from https://leancrew.com/all-this/2020/06/ordinal-numerals-and-javascript/
   * 
   * @example
   * ```
   * formatToOrdinal(3); // '3rd'
   * ```
   */
  public formatToOrdinal(n: number) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /**
   * Retrieves the guild of a player
   * 
   * @param discord_id The user Snowflake provided by Discord
   * @param options
   * @param query The username or UUID of the player
   * @returns The guild of the player
   */
  public async fetchHypixelGuild(
    discord_id: string,
    { allowFallback = true, byMember = false, includeMember = false },
    query?: string
  ) {
    if (query) {
      if (byMember) {
        const data = await this.client.hypixel.getUsernameAndUUID(query);
        const guild = await this.client.hypixel.guild(data.uuid, 'player');

        return includeMember
          ? {
              guild,
              username: data!.username,
              uuid: data!.uuid
            }
          : guild;
      }

      return this.client.hypixel.guild(query, 'name');
    }

    if (allowFallback === false) throw 'Guild not found.';

    const uuid = await this.getConnectedUUID(discord_id);

    if (uuid) {
      const data = includeMember
        ? await this.client.hypixel.getUsernameAndUUID(uuid)
        : null;
      const guild = await this.client.hypixel.guild(uuid, 'player');

      return includeMember
        ? {
            guild,
            username: data!.username,
            uuid: data!.uuid
          }
        : guild;
    }

    throw 'Guild not found.';
  }

  public async imageScroller(
    channel:
      | TextChannel
      | NewsChannel
      | DMChannel
      | PartialDMChannel
      | CommandInteraction,
    user: User,
    images: Buffer[],
    message: (index: number) => string,
    {
      page = 0,
      reply
    }: {
      page?: number;
      reply?: MessageResolvable;
    }
  ) {
    const emojis = ['◀️', '▶️'];

    while (true) {
      const sent = await this.message(channel, {
        reply,
        message: message(page),
        files: [
          {
            name: 'image.png',
            attachment: images[page]
          }
        ]
      });

      for (const emoji of emojis) await sent.react(emoji);

      const index =
        (await this.client.util.awaitReactionIndex(sent, user, emojis, false)) * 2 - 1;
      if (index === -3) {
        await sent.reactions.removeAll();

        break;
      }

      page =
        page + index >= 0
          ? (page + index) % images.length
          : page + index + images.length;

      await sent.delete();
    }
  }

  public async scroller(
    channel:
      | TextChannel
      | NewsChannel
      | DMChannel
      | PartialDMChannel
      | CommandInteraction,
    user: User,
    {
      fields = [],
      maxFields = 15,
      description,
      icon,
      footer,
      title,
      reply
    }: {
      fields: EmbedFieldData[];
      maxFields?: number;
      description?: string;
      icon?: string;
      title?: string | { name: string; icon_url?: string | null };
      footer?: { text?: string; icon_url?: string; timestamp?: number };
      reply?: MessageResolvable;
    }
  ) {
    const key = typeof title === 'string' ? 'title' : 'author';

    if (fields.length > maxFields) {
      const chunked = this.chunkArray(fields, maxFields);

      let current = 0;

      const getTitle =
        title === undefined || typeof title === 'string'
          ? () =>
              `${title !== null ? title : ''} ${current + 1}/${chunked.length}`
          : () => ({
              name: `${title.name} ${current + 1}/${chunked.length}`,
              icon_url: title.icon_url
            });

      const message = await this.message(channel, {
        reply,
        embed: {
          fields: chunked[current],
          description,
          [key]: getTitle(),
          thumbnail: { url: icon },
          timestamp:
            footer?.timestamp ??
            (this.client.config.embed.timestamp ? Date.now() : undefined),
          footer: footer?.text
            ? {
                text: footer.text,
                icon_url: footer.icon_url
              }
            : this.client.config.embed.footer
        }
      });

      const emojis = ['◀️', '▶️'];
      for (const emoji of emojis) await message.react(emoji);

      while (true) {
        const index =
          (await this.client.util.awaitReactionIndex(message, user, emojis)) *
            2 -
          1;
        if (index === -3) break;

        current =
          current + index >= 0
            ? (current + index) % chunked.length
            : current + index + chunked.length;

        await this.message(message, {
          reply,
          embed: {
            fields: chunked[current],
            description,
            [key]: getTitle(),
            thumbnail: { url: icon },
            timestamp:
              footer?.timestamp ??
              (this.client.config.embed.timestamp ? Date.now() : undefined),
            footer: footer?.text
              ? {
                  text: footer.text,
                  icon_url: footer.icon_url
                }
              : this.client.config.embed.footer
          }
        });
      }

      if (channel.type !== 'DM') await message.reactions.removeAll();

      return null;
    }

    await this.message(channel, {
      reply,
      embed: {
        fields,
        description,
        [key]: title,
        timestamp:
          footer?.timestamp ??
          (this.client.config.embed.timestamp ? Date.now() : undefined),
        footer: footer?.text
          ? {
              text: footer.text,
              icon_url: footer.icon_url
            }
          : this.client.config.embed.footer
      }
    });

    return null;
  }

  public chunkArray<T>(array: T[], size = 25): T[][] {
    const chunked = [];

    while (array.length > 0) {
      chunked.push(array.splice(0, size));
    }

    return chunked;
  }

  public timeUntilCron(crontab: string, iterations = 1, timestamp = true) {
    const cron = parser.parseExpression(crontab);

    for (let i = 1; i < iterations; ++i) {
      cron.next();
    }

    const time = cron.next().getTime();

    return timestamp
      ? `<t:${Math.floor(time / 1000)}:R>`
      : dayjs(time).fromNow(true);
  }

  public hexToRgb(hex: string): [number, number, number] {
    // @ts-ignore
    return hex
      .match(/^#(\w\w)(\w\w)(\w\w)$/)!
      .slice(1)
      .map(n => parseInt(n, 16));
  }

  public hslToRgb(h: number, s: number, l: number) {
    let r, g, b;

    if (s == 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;

        if (t < 1 / 6) return p + (q - p) * 6 * t;

        if (t < 1 / 2) return q;

        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      g = hue2rgb(p, q, h);
      r = hue2rgb(p, q, h + 1 / 3);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  public rgbToHsl(r: number, g: number, b: number) {
    (r /= 255), (g /= 255), (b /= 255);

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
          break;
      }
    }

    return [h / 6, s, l];
  }

  public createPalette(
    hex: string,
    colours = 5,
    { coloursPerPalette = 3 } = { coloursPerPalette: 3 }
  ) {
    const batches = Math.ceil(colours / coloursPerPalette);

    const rgb = this.hexToRgb(hex);
    let [h] = this.rgbToHsl(...rgb);

    const palette = [];

    const sInc = 0.8 / (coloursPerPalette + 1);
    const hInc = 25 / 360;

    let hStart = h - Math.floor(batches / 2) * hInc;

    for (let i = 0; i < batches; ++i) {
      let sStart = 0.2;

      for (let x = 0; x < coloursPerPalette; ++x) {
        const [r, g, b] = this.hslToRgb(
          hStart > 1 ? hStart - 1 : hStart < 0 ? hStart + 1 : hStart,
          1 - sStart,
          sStart
        );

        palette.unshift(`${r}, ${g}, ${b}`);

        sStart += sInc;
      }

      sStart = 0.2;
      hStart += hInc;
    }

    return palette;
  }
}
