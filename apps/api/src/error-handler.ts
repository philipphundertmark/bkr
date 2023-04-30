import express from 'express';

export const errorHandler: express.ErrorRequestHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
) => {
  console.log(err);

  res.status(500);
  res.json({
    error: 'Internal Server Error',
  });
};
