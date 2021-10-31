import Handler from '../classes/Handler';
import type Main from '../classes/Main';

export default class Ready extends Handler {
  constructor(client: Main) {
    super(client);
  }

  public async init() {}

  public async ready() {
    return this.client.ready();
  }
}
