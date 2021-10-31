import path from 'path';

import { ShardingManager } from 'discord.js-light';

import config from './config';

/**
 * Creates a progress bar
 * 
 * @param current The nominator out of the progress
 * @param total The donominator of the progress
 * @param length The length of the bar
 * @returns The progress bar
 * 
 * @example
 * ```
 * bar(16, 100, 20);
 * ```
 */
function bar(current: number, total: number, length: number = 15) {
  const boxes = Math.ceil((current / total) * length);

  return `\x1b[1m\x1b[34m${'█'.repeat(boxes)}\x1b[0m${'█'.repeat(
    length - boxes
  )}`;
}

(async () => {
  const start = Date.now();
  const manager = new ShardingManager(path.join(__dirname, 'index.js'), {
    token: config.token
  });
  const total =
    (manager.totalShards === 'auto' ? 1 : manager.totalShards) || 1;

  process.stdout.write(
    `\r[  \x1b[1m\x1b[33mLoad\x1b[0m  ] Spawning shards... ${bar(
      manager.shards.size,
      total
    )} (${((manager.shards.size * 100) / total).toFixed(2)}%)`
  );

  manager.on('shardCreate', () => {
    const total =
      manager.totalShards === 'auto'
        ? manager.shards.size
        : manager.totalShards;

    process.stdout.write(
      `\r[  \x1b[1m\x1b[33mLoad\x1b[0m  ] Spawning shards... ${bar(
        manager.shards.size,
        total
      )} (${((manager.shards.size * 100) / total).toFixed(2)}%)`
    );
  });

  await manager.spawn();

  console.log(
    `\n[ \x1b[1m\x1b[32mOnline\x1b[0m ] Spawned \x1b[1m\x1b[34m${
      manager.shards.size
    } shards\x1b[0m in \x1b[1m\x1b[32m${
      (Date.now() - start) / 1000
    } seconds\x1b[0m`
  );
})();
