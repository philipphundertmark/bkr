import { NextFunction, Request, RequestHandler, Response } from 'express';

export const handler = (handler: RequestHandler) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
