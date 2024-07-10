import { Response } from 'express';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

interface LiveClient {
  id: number;
  response: Response;
}

export class LiveService {
  private clients: LiveClient[] = [];

  registerClient(res: Response): number {
    const clientId = Date.now();
    const newClient = { id: clientId, response: res };

    this.clients.push(newClient);

    return clientId;
  }

  sendEvent(event: LiveEvent): void {
    this.clients.forEach((client) =>
      client.response.write(`data: ${LiveEventUtils.serialize(event)}\n\n`),
    );
  }

  unregisterClient(clientId: number): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }
}
