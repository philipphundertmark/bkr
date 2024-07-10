import { Router } from 'express';

import { LiveService } from '../services/live.service';
import { handler } from './handler';

export function LiveController(liveService: LiveService): Router {
  const router = Router();

  router.get(
    '/live',
    handler(async (req, res) => {
      const headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      };
      res.writeHead(200, headers);

      const clientId = liveService.registerClient(res);
      console.log(`[Client ${clientId}] Connection opened`);

      req.on('close', () => {
        console.log(`[Client ${clientId}] Connection closed`);
        liveService.unregisterClient(clientId);
      });
    }),
  );

  return router;
}
