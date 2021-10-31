'use strict';

export default class Parser {
  constructor() {
    throw new Error('This class cannot be instantiated.');
  }

  public static id(identifier: string) {
    return identifier.match(/(\d+)>$/)?.[1] ?? identifier;
  }

  public static emoji(identifier: string) {
    return identifier.match(/(\d+)>$/)?.[1] ?? identifier;
  }
}
