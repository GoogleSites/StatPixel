import { Collection } from 'discord.js-light';
import type { ApplicationCommandOptionData } from 'discord.js-light';

import type { Message, MessageOptions } from '../typings';
import type Argument from './Argument';
import type Main from './Main';

export default class BaseCommand {
  private parent: BaseCommand | null;
  private _path?: string;

  public id: string;
  public children: Collection<string, BaseCommand>;
  public client: Main;
  public arguments: Argument[];
  public aliases: string[];
  public owner: boolean;
  public admin: boolean;
  public description?: string;
  public enabled: boolean;

  constructor(id: string, client: Main) {
    this.id = id;
    this.aliases = [this.id];
    this.client = client;
    this.children = new Collection();
    this.parent = null;
    this.arguments = [];
    this.owner = false;
    this.admin = false;
    this.enabled = true;
  }

  public async init(): Promise<BaseCommand> {
    return this;
  }

  public async run(
    _: Message,
    ...__: any[]
  ): Promise<MessageOptions | string | null> {
    return null;
  }

  public find(args: string[]): [string[], BaseCommand] {
    if (args.length === 0) return [args, this];

    const name = args[0].toLowerCase();
    const command = this.children.find(c => c.aliases.includes(name));

    if (command) {
      args.splice(0, 1);
    }

    return command
      ? command.children.size > 0
        ? command.find(args)
        : [args, command]
      : [args, this];
  }

  public addChild(command: BaseCommand) {
    command.setParent(this);
    this.children.set(command.id, command);
  }

  public removeChild(id: string) {
    this.children.delete(id);
  }

  public sortChildren() {
    this.children = this.children.sort((a, b) => a.name.localeCompare(b.name));
    this.children.forEach(c => c.sortChildren());
  }

  public setParent(parent: BaseCommand) {
    this.parent = parent;
  }

  public get formattedName(): string {
    return `${this.name[0].toUpperCase()}${this.name.slice(1)}`;
  }

  public get name(): string {
    return this.aliases[0];
  }

  public get formattedPath(): string[] {
    return [...(this.parent?.formattedPath ?? []), this.formattedName];
  }

  public get path(): string[] {
    return [...(this.parent?.path ?? []), this.name];
  }

  public get connectedPath(): string {
    return (
      this._path ??
      (this._path = [...(this.parent?.path ?? []), this.name].join(' '))
    );
  }

  public get slashCommandData(): ApplicationCommandOptionData {
    return {
      type: this.children.size > 0 ? 'SUB_COMMAND_GROUP' : 'SUB_COMMAND',
      name: this.name,
      description: this.description ?? 'No description',
      options: this.children
        .map(c => c.slashCommandData)
        .concat(this.arguments.map(a => a.slashCommandData))
    };
  }
}
