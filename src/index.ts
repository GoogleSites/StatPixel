import path from 'path';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Intents, Options } from 'discord.js-light';

import Main from './classes/Main';

(async () => {
  dayjs.extend(relativeTime);
  dayjs.extend(duration);
  dayjs.extend(utc);

  const client = new Main({
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
    intents: [
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING
    ],
    makeCache: Options.cacheWithLimits({
      GuildManager: Infinity,
      ChannelManager: Infinity
    })
  });

  await client.load();
  await client.addCommandFolder(path.join(__dirname, 'commands'));
  await client.addHandlerFolder(path.join(__dirname, 'handlers'));

  const { disabled: commands } = await client.database.static.findOne({
    _id: client.config.static
  });

  for (const command of commands) {
    const keys = command.split(',');
    let end = client.commands.get(keys.shift())!;

    for (const key of keys) {
      end = end.children.get(key)!;
    }

    end.enabled = false;
  }

  client.registerListeners();
  client.login();
  
  client.on('error', console.warn);
  client.on('warn', console.warn);
  client.on('shardError', console.warn);

  process.on('uncaughtException', console.warn);
  process.on('unhandledRejection', console.warn);
})();