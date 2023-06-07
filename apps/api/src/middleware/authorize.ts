import * as express from 'express';

import { Role } from '@bkr/api-interface';

import { ForbiddenException, UnauthorizedException } from '../errors';

export function authorize(...roles: Role[]) {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    if (!roles.length) {
      return next();
    }

    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException();
    }

    return next();
  };
}
