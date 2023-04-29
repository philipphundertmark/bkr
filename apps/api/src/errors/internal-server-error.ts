import { Response } from 'express';

import { error } from './error';

export function internalServerError(res: Response, message?: string): void {
  error(res, 500, message ?? 'Internal Server Error');
}
