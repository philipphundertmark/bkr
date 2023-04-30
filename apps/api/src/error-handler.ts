import express from 'express';

import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from './errors';

export const errorHandler: express.ErrorRequestHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
) => {
  if (err instanceof BadRequestException) {
    res.status(400);
    res.json({
      error: err.message,
    });

    return;
  }

  if (err instanceof UnauthorizedException) {
    res.status(401);
    res.json({
      error: err.message,
    });

    return;
  }

  if (err instanceof ForbiddenException) {
    res.status(403);
    res.json({
      error: err.message,
    });

    return;
  }

  if (err instanceof InternalServerErrorException || err instanceof Error) {
    res.status(500);
    res.json({
      error: err.message,
    });

    return;
  }

  res.status(500);
  res.json({
    error: 'Unknown Error',
  });
};
