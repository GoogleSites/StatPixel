import type { ApplicationCommandOptionData } from 'discord.js-light';

import type { Message } from '../typings';

export default class Argument {
  private fn: Function;
  private error: string;
  private remaining: boolean;
  private overwrite: boolean;
  private boolean: boolean;
  private array: boolean;
  public optional: boolean;
  private startAt: number | null;
  private stopAt: number | null;
  private internalOptional: boolean;

  public name: string;
  public description: string;

  constructor(
    name: string,
    description: string,
    fn: Function,
    error: string,
    {
      remaining = false,
      overwrite = false,
      boolean = false,
      array = false,
      optional = false,
      startAt = null,
      stopAt = null,
      _optional
    }: {
      remaining?: boolean;
      overwrite?: boolean;
      boolean?: boolean;
      array?: boolean;
      optional?: boolean;
      startAt?: number | null;
      stopAt?: number | null;
      _optional?: boolean;
    } = {
      remaining: false,
      overwrite: false,
      boolean: false,
      array: false,
      optional: false,
      startAt: null,
      stopAt: null
    }
  ) {
    this.name = name;
    this.description = description;
    this.fn = fn;
    this.error = error;
    this.remaining = remaining;
    this.overwrite = overwrite;
    this.boolean = boolean;
    this.array = array;
    this.optional = optional;
    this.startAt = startAt;
    this.stopAt = stopAt;
    this.internalOptional = _optional !== undefined ? _optional : this.optional;
  }

  public async check(
    message: Message,
    args: string[],
    index: number
  ): Promise<boolean | string> {
    if (args[index] === undefined && this.optional) return false;

    if (this.remaining)
      var array = args
        .slice(index)
        .slice(this.startAt ?? 0, this.stopAt ?? Infinity);

    try {
      var result: any = await this.fn(
        // @ts-ignore
        this.remaining ? (this.array ? array : array.join(' ')) : args[index],
        message
      );
    } catch (e) {
      var result: any = false;
    }

    if (result === undefined || result === null || result === false)
      return this.error;

    if (this.overwrite)
      args[index] = !this.boolean ? result : !!result;

    return true;
  }

  public static isNumber(argument: string): number | null {
    const number = parseFloat(argument);
    return number === 0 ? number : number || null;
  }

  public static isWholeNumber(argument: string): number | null {
    const number = parseFloat(argument);
    return number === 0 ? number : Math.round(number) || null;
  }

  public static isPositiveInteger(argument: string): number | null {
    const number = parseFloat(argument);
    return number === 0 ? number : Math.round(Math.abs(number)) || null;
  }

  public static isPositiveNumber(argument: string): number | null {
    const number = parseFloat(argument);
    return number === 0 ? number : Math.abs(number) || null;
  }

  public static isPresent(argument?: string): string | undefined {
    return argument;
  }

  public static toLowerCase(argument?: string): string | undefined {
    return argument?.toLowerCase();
  }

  public static parseTime(time: string): number | null {
    const match: { [key: string]: number } = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      w: 604800000
    };

    const map = [...time.matchAll(/(\d+)([smhdw])/g)];

    return map
      ? map.reduce((a: number, m: any) => a + (match[m[2]] * m[1] || 0), 0)
      : null;
  }

  public get slashCommandData(): ApplicationCommandOptionData {
    return {
      type: 'STRING',
      name: this.name,
      description: this.description,
      required: !this.internalOptional
    };
  }
}
