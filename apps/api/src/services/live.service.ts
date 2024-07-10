import { Server } from 'socket.io';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

export class LiveService {
  constructor(private readonly io: Server) {}

  sendEvent(event: LiveEvent): void {
    this.io.emit('event', LiveEventUtils.serialize(event));
  }
}
