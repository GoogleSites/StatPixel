import { MongoClient } from 'mongodb';
import type { Collection, Db } from 'mongodb';

export default class DatabaseManager {
  private connection: MongoClient | null;
  private database: Db | null;
  private databaseName: string;
  private connectionURL: string;

  constructor(url: string, database: string) {
    this.connectionURL = url;
    this.databaseName = database;

    this.connection = null;
    this.database = null;
  }

  public async init() {
    // Connect to the database
    this.connection = await MongoClient.connect(this.connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Select a database
    this.database = this.connection.db(this.databaseName);

    await Promise.all([
      this.guilds.createIndex({ guild_id: 1 }),
      this.users.createIndex({ discord_id: 1 }),
      this.metrics.createIndex({ key: 1 }),
      this.commands.createIndex({ discord_id: 1, guild_id: 1 }),
      this.history.createIndex({ uuid: 1 }),
      this.hypixel_guilds.createIndex({ id: 1 }),
      this.hypixel_players.createIndex({ uuid: 1 })
    ]);
  }

  get hypixel_guilds(): Collection<any> {
    return this.database!.collection('hypixel_guilds');
  }

  get hypixel_players(): Collection<any> {
    return this.database!.collection('hypixel_players');
  }

  get guilds(): Collection<any> {
    return this.database!.collection('guilds');
  }

  get users(): Collection<any> {
    return this.database!.collection('users');
  }

  get reactions(): Collection<any> {
    return this.database!.collection('reactions');
  }

  get static(): Collection<any> {
    return this.database!.collection('static');
  }

  get commands(): Collection<any> {
    return this.database!.collection('commands');
  }

  get metrics(): Collection<any> {
    return this.database!.collection('metrics');
  }

  get history(): Collection<any> {
    return this.database!.collection('history');
  }
}
