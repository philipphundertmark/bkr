import express from 'express';

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '.';

export const errorHandler: express.ErrorRequestHandler = (
  err: unknown,
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

  if (err instanceof NotFoundException) {
    res.status(404);
    res.json({
      error: err.message,
    });

    return;
  }

  const message = err instanceof Error ? err.message : 'Unknown error';
  console.log(message);

  res.status(500);
  res.json({
    error: message,
  });
};
