import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { Role, isRole } from '@bkr/api-interface';

import { config } from '../config';
import { ForbiddenException, UnauthorizedException } from '../errors';

export function hasRole(...roles: Role[]) {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    const authorization = req.headers['authorization'];

    if (typeof authorization !== 'string') {
      throw new UnauthorizedException();
    }

    const token = authorization.replace('Bearer ', '');
    let payload: string | jwt.JwtPayload;

    try {
      payload = jwt.verify(token, config.SECRET);
    } catch (err) {
      throw new UnauthorizedException();
    }

    if (typeof payload === 'string') {
      throw new UnauthorizedException();
    }

    const sub = payload.sub ?? '';
    const role = payload.role;
    const username = payload.username;

    if (typeof role !== 'string' || !isRole(role) || !roles.includes(role)) {
      throw new ForbiddenException();
    }

    req.user = {
      sub,
      username,
      role,
    };

    return next();
  };
}
