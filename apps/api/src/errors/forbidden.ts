import { Response } from 'express';

import { error } from './error';

export function forbidden(res: Response, message?: string): void {
  error(res, 403, message ?? 'Forbidden');
}

export class ForbiddenException extends Error {
  constructor(message?: string) {
    super(message ?? 'Forbidden');
  }
}
