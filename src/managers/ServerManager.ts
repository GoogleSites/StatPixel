import axios from 'axios';
import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cors from 'fastify-cors';

import type Main from '../classes/Main';

export default class ServerManager {
  private client: Main;
  private updateInterval: number;
  private port: number;
  private _server: FastifyInstance;
  private cache: {
    users: number;
    guilds: number;
    profiles: number;
    last_updated: number;
  };

  public lastUpdate: number = 0;

  constructor(client: Main, port = 3000, updateInterval = 300000) {
    this.client = client;
    this.updateInterval = updateInterval;
    this.port = port;

    this._server = fastify({
      logger: true,
      trustProxy: true
    });

    this._server.register(cors, {
      origin: true
    });

    this.cache = {
      last_updated: 0,
      users: 0,
      guilds: 0,
      profiles: 0
    };
  }

  private async fetchStatistics() {
    if (Date.now() - this.cache.last_updated <= 300000) return this.cache;

    const { users, guilds } = (
      await this.client.shard!.broadcastEval(client => ({
        guilds: client.guilds.cache.size,
        users: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
      }))
    ).reduce(
      (a, b) => {
        a.guilds += b.guilds;
        a.users += b.users;

        return a;
      },
      { guilds: 0, users: 0 }
    );

    return (this.cache = {
      last_updated: Date.now(),
      users,
      guilds,
      profiles: await this.client.database.users.countDocuments()
    });
  }

  public async init() {
    if (this.client.shard!.ids.includes(0) === false) return;

    this.statistics();

    this._server.get('/statistics', async () => {
      const { users, guilds, profiles } = await this.fetchStatistics();

      return {
        users,
        guilds,
        profiles
      };
    });

    console.log(await new Promise(r => this._server.listen(this.port, '0.0.0.0', r)));
  }

  private async statistics() {
    while (false) {
      this.lastUpdate = Date.now();

      await axios.post(
        `https://top.gg/api/bots/${this.client.user!.id}/stats`,
        {
          server_count: await this.client.shard!.broadcastEval(
            client => client.guilds.cache.size
          )
        },
        {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxODY4NzM0ODg4MzE5MzkxNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI2MTk3NDQ3fQ.D8XCLJ0X2GcE-xuxFBJLzY8swGpbyJ8B7587txXld4o'
          }
        }
      );

      await this.client.util.sleep(this.updateInterval);
    }
  }
}
