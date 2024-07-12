import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from './errors/error-handler';
import { logger } from './logger';
import { authenticate } from './middleware/authenticate';

export interface AppConfig {
  origin: string;
}

/**
 * Create an express app with the given request handlers and config
 *
 * @param handlers The request handlers to use
 * @param config The app config
 * @returns The configured express app
 */
export const setupApp = (
  app: express.Application,
  handlers: express.RequestHandler[],
  config?: AppConfig,
): void => {
  // Middleware
  app.use(cors({ origin: config?.origin }));
  app.use(express.json());
  app.use(helmet());
  app.use(logger);

  // Authentication
  app.use(authenticate);

  // Request handlers
  app.use(...handlers);

  // Error handler
  app.use(errorHandler);
};
