import type {
  CommandInteraction,
  User as DiscordUser,
  Guild,
  Message as RealDiscordMessage,
  TextChannel
} from 'discord.js-light';
import { GuildMember } from 'discord.js-light';

import type BaseCommand from '../classes/BaseCommand';
import Handler from '../classes/Handler';
import type Main from '../classes/Main';
import type { Message as DiscordMessage, Settings, User } from '../typings';

export default class Message extends Handler {
  private userRegExp?: RegExp;

  constructor(client: Main) {
    super(client);
  }

  private async handleCommandPermissions(
    author: DiscordUser,
    guild: Guild | null,
    command: BaseCommand
  ) {
    const user: User | null = await this.client.database.users.findOne({
      discord_id: author.id
    });

    if (user !== null && user.banned_until && user.banned_until > Date.now()) {
      throw {
        embed: undefined,
        message: `**Uh oh!**

It looks like you've been banned from using StatPixel. You can appeal your punishment by contacting a member of staff in our Support Discord. 
Please note, the reasoning behind your ban has been logged.

Unbanned: ${
          isFinite(user.banned_until)
            ? `<t:${Math.floor(user.banned_until / 1000)}:R>`
            : '**Never**'
        }`
      };
    }

    const isAdmin =
      command.owner || command.admin
        ? this.client.config.admins.includes(author.id)
        : false;

    if (command.admin && !isAdmin) return;
    if (command.owner) {
      if (guild === null) {
        throw {
          embed: {
            description: 'This command can only be run in a server.'
          }
        };
      }

      if (!isAdmin && guild.ownerId !== author.id) {
        throw {
          embed: {
            description: 'Only the owner of this server can run this command.'
          }
        };
      }
    }

    this.client.database.metrics.updateOne(
      { key: command.connectedPath },
      {
        $inc: {
          uses: 1
        }
      },
      { upsert: true }
    );

    this.client.database.commands.updateOne(
      {
        key: command.connectedPath,
        discord_id: author.id,
        guild_id: guild !== null ? guild.id : this.client.user!.id
      },
      {
        $inc: {
          uses: 1
        }
      },
      { upsert: true }
    );
  }

  public async init() {}

  public async ready() {
    this.userRegExp = new RegExp(`^<@!?${this.client.user!.id}>`);
  }

  public async interactionCreate(interaction: CommandInteraction) {
    if (interaction.type !== 'APPLICATION_COMMAND') return;

    await interaction.deferReply();

    const config =
      interaction.guild === null
        ? this.client.config.defaultConfiguration
        : await this.client.fetchSettings(interaction.guild.id);

    const image = this.client.commands.get('image')!;
    const text = this.client.commands.get('text')!;

    const base = this.client.config.textGamemodes.has(interaction.commandName)
      ? config.text === false && image.children.has(interaction.commandName)
        ? image.children.get(interaction.commandName)!
        : text.children.get(interaction.commandName)!
      : this.client.commands.get(interaction.commandName)!;

    const subName = interaction.options.getSubcommand() || interaction.options.getSubcommandGroup();
    const sub = subName ? interaction.options.get(subName) : null;
    const command = sub ? base.children.get(sub.name)! : base;

    try {
      await this.handleCommandPermissions(
        interaction.user,
        interaction.guild,
        command
      );
    } catch (e) {
      console.log(e);

      return this.client.util.message(interaction, e);
    }

    const args: any[] = [];

    const forged: DiscordMessage = {
      author: interaction.user,
      member:
        interaction.member instanceof GuildMember ? interaction.member : null,
      _settings: config,
      channel: interaction,
      guild: interaction.guild,
      content: ''
    };

    for (const [i, argument] of command.arguments.entries()) {
      const option = sub?.options ? sub.options.find(
        o => o.name === argument.name
      ) : interaction.options.get(argument.name);

      if (option) args.push(...(option.value as string).split(/\s/g));

      const error = await argument.check(forged, args, i);

      if (error && error !== true && !argument.optional) {
        return await this.client.util.message(forged.channel, {
          embed: { description: error.replace(/\{prefix\}/, config.prefix) },
          reply: forged.id
        });
      }
    }

    try {
      const result = await command.run(forged, ...args);

      if (result === null || result === undefined) return;

      return typeof result === 'string'
        ? await this.client.util.message(forged.channel, {
            embed: { description: result },
            reply: forged.id
          })
        : await this.client.util.message(forged.channel, {
            reply: forged.id,
            ...result
          });
    } catch (e) {
      if (e.stack) console.error(e);

      return await this.client.util.message(forged.channel, {
        reply: forged.id,
        embed: {
          description:
            typeof e === 'string'
              ? e
              : 'An error occurred while running the command.'
        }
      });
    }
  }

  public async messageCreate(
    message: RealDiscordMessage & { _settings: Settings; guild: Guild }
  ) {
    if (message.author.bot) return;

    const usesTag = this.userRegExp!.test(message.content);
    const config =
      message.guild === null
        ? this.client.config.defaultConfiguration
        : await this.client.fetchSettings(message.guild.id);

    if (
      usesTag === false &&
      (message.content.startsWith(config.prefix) === false ||
        message.content.length === config.prefix.length)
    )
      return;

    const args = [
      ...message.content
        .slice(
          usesTag
            ? message.content[2] === '!'
              ? 22
              : 21
            : config.prefix.length
        )
        .trimStart()
        .matchAll(/"(.+?)"(?![^ \t]+)|([^ \t]+)/gs)
    ].map(m => m[2] || m[1].replace(/""/g, '"'));

    if (usesTag && !args[0])
      args[0] = 'help';

    if (this.client.config.textGamemodes.has(args[0]))
      args.unshift(
        config.text === false && this.client.config.imageGamemodes.has(args[0])
          ? 'image'
          : 'text'
      );

    const [remaining, command] = this.client.find(args);

    if (!command) return;

    try {
      await this.handleCommandPermissions(
        message.author,
        message.guild,
        command
      );
    } catch (e) {
      return await this.client.util.message(message.channel as TextChannel, {
        ...e,
        reply: message.id
      });
    }

    message.channel.sendTyping();

    // Process arguments
    for (const [i, argument] of command.arguments.entries()) {
      const error = await argument.check(
        message as DiscordMessage,
        remaining,
        i
      );

      if (error && error !== true) {
        return await this.client.util.message(message.channel as TextChannel, {
          embed: { description: error.replace(/\{prefix\}/, config.prefix) },
          reply: message.id
        });
      }
    }

    message._settings = config;

    try {
      const result = await command.run(message as DiscordMessage, ...remaining);

      if (result === null || result === undefined) return;

      return typeof result === 'string'
        ? await this.client.util.message(message.channel as TextChannel, {
            embed: { description: result },
            reply: message.id
          })
        : await this.client.util.message(message.channel as TextChannel, {
            reply: message.id,
            ...result
          });
    } catch (e) {
      if (e.stack) console.error(e);

      return await this.client.util.message(message.channel as TextChannel, {
        reply: message.id,
        embed: {
          description:
            typeof e === 'string'
              ? e
              : 'An error occurred while running the command.'
        }
      });
    }
  }
}
