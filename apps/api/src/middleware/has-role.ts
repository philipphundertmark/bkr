import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { Role, isRole } from '@bkr/api-interface';

import { config } from '../config';
import { unauthorized } from '../errors';

export function hasRole(...roles: Role[]) {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    const authorization = req.headers['authorization'];

    if (typeof authorization !== 'string') {
      return unauthorized(res);
    }

    const token = authorization.replace('Bearer ', '');
    let payload: string | jwt.JwtPayload;

    try {
      payload = jwt.verify(token, config.SECRET);
    } catch (err) {
      console.error(err);
      return unauthorized(res);
    }

    if (typeof payload === 'string') {
      return unauthorized(res);
    }

    const sub = payload.sub ?? '';
    const role = payload.role;
    const username = payload.username;

    if (typeof role !== 'string' || !isRole(role) || !roles.includes(role)) {
      return unauthorized(res);
    }

    req.user = {
      sub,
      username,
      role,
    };

    return next();
  };
}
