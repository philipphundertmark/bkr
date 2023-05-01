import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from './errors/error-handler';
import { logger } from './logger';

export interface AppConfig {
  origin: string;
}

export const createApp = (
  handlers: express.RequestHandler[],
  config?: AppConfig
): express.Application => {
  const app = express();

  // Middleware
  app.use(cors({ origin: config?.origin }));
  app.use(express.json());
  app.use(helmet());
  app.use(logger);

  // Request handlers
  app.use(...handlers);

  // Error handler
  app.use(errorHandler);

  return app;
};
