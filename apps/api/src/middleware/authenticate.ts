import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { config } from '../config';

export function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const authorization = req.headers['authorization'];

  if (typeof authorization !== 'string') {
    return next();
  }

  const token = authorization.replace('Bearer ', '');
  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, config.SECRET);
  } catch (err) {
    return next();
  }

  if (typeof payload === 'string') {
    return next();
  }

  req.user = {
    sub: payload.sub ?? '',
    username: payload.username,
    role: payload.role,
  };

  return next();
}
