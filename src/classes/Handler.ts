import type Main from './Main';

export default class Handler {
  public client: Main;

  constructor(client: Main) {
    this.client = client;
  }
}
