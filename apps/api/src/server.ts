import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

import { errorHandler } from './error-handler';
import { logger } from './logger';

export interface ServerConfig {
  origin: string;
}

export const createServer = (
  handlers: express.RequestHandler[],
  config?: ServerConfig
): http.Server => {
  const app = express();
  const server = http.createServer(app);

  // Middleware
  app.use(cors({ origin: config?.origin }));
  app.use(express.json());
  app.use(helmet());
  app.use(logger);

  // Request handlers
  app.use(...handlers);

  // Error handler
  app.use(errorHandler);

  return server;
};
