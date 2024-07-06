import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { config } from '../config';
import { UnauthorizedException } from '../errors';

export function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
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

  if (
    typeof payload === 'string' ||
    typeof payload.sub !== 'string' ||
    typeof payload.iat !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    throw new UnauthorizedException();
  }

  req.user = {
    sub: payload.sub,
    role: payload.role,
    iat: payload.iat,
    exp: payload.exp,
  };

  return next();
}
