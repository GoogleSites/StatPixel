import type {
  GuildChannel,
  Message,
  MessageReaction,
  User
} from 'discord.js-light';

import Handler from '../classes/Handler';
import type Main from '../classes/Main';

export default class Reactions extends Handler {
  constructor(client: Main) {
    super(client);
  }

  public async init() {}

  public async channelDelete(channel: GuildChannel) {
    // Delete all reaction handlers in the database that belong to the deleted channel
    await this.client.database.reactions.deleteMany({ channel_id: channel.id });
  }

  public async messageDelete(message: Message) {
    // Delete all reaction handlers in the database that belong to the deleted message
    await this.client.database.reactions.deleteOne({
      message_id: message.id,
      channel_id: message.channel.id
    });
  }

  public async messageReactionAdd(reaction: MessageReaction, user: User) {
    if (user.bot || reaction.message.channel.type === 'DM') return;

    // Get reaction information from database
    const document = await this.client.database.reactions.findOne({
      message_id: reaction.message.id,
      filter: { $in: [reaction.emoji.name, reaction.emoji.id] }
    });

    if (document === null) return;

    // Filter by user
    if (
      Array.isArray(document.users) &&
      document.users.length > 0 &&
      document.users.includes(user.id) === false
    )
      return;

    // Emit the event
    this.client.emit(document.event, reaction, user, document.data, document);

    if (!document.removeEvent && document.remove !== false)
      reaction.users.remove(user.id).catch(() => {});
  }

  public async messageReactionRemove(reaction: MessageReaction, user: User) {
    if (user.bot || reaction.message.channel.type === 'DM') return;

    // Get the reaction from the database
    const document = await this.client.database.reactions.findOne({
      message_id: reaction.message.id,
      filter: { $in: [reaction.emoji.name, reaction.emoji.id] },
      removeEvent: { $ne: null }
    });

    if (document === null) return;

    // Filter by user
    if (
      Array.isArray(document.users) &&
      document.users.length > 0 &&
      document.users.includes(user.id) === false
    )
      return;

    this.client.emit(
      document.removeEvent,
      reaction,
      user,
      document.data,
      document
    );
  }
}
