'use strict';

import type { Guild } from 'discord.js-light';

import type Main from '../classes/Main';
import Parser from './Parser';

const EMOJI_REGEX =
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/;

export default class Find {
  private client: Main;

  constructor(client: Main) {
    this.client = client;
  }

  public async member(identifier: string, guild: string | Guild) {
    try {
      const g =
        typeof guild === 'string'
          ? this.client.guilds.cache.get(guild as `${bigint}`)
          : guild;
      return g
        ? await g.members.fetch(Parser.id(identifier) as `${bigint}`)
        : null;
    } catch {
      return null;
    }
  }

  public async channel(identifier: string, type = 'text') {
    const channel = await this.client.channels
      .fetch(Parser.id(identifier) as `${bigint}`)
      .catch(() => null);
    return type === 'any' ? channel : channel?.type === type ? channel : null;
  }

  public async role(identifier: string, guild: string | Guild) {
    try {
      const g =
        typeof guild === 'string'
          ? this.client.guilds.cache.get(guild as `${bigint}`)
          : guild;
      return g
        ? await g.roles.fetch(
            identifier === '@everyone'
              ? g.id
              : (Parser.id(identifier) as `${bigint}`)
          )
        : null;
    } catch {
      return null;
    }
  }

  public async roleOrMember(identifier: string, guild: string | Guild) {
    return (
      (await this.role(identifier, guild)) ??
      (await this.member(identifier, guild))
    );
  }

  public emoji(identifier: string, guild: string | Guild) {
    try {
      if (EMOJI_REGEX.test(identifier)) return identifier;

      const g =
        typeof guild === 'string'
          ? this.client.guilds.cache.get(guild as `${bigint}`)
          : guild;
      return g
        ? g.emojis.cache.get(Parser.id(identifier) as `${bigint}`)
        : null;
    } catch {
      return null;
    }
  }
}
