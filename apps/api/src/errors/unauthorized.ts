import { Response } from 'express';

import { error } from './error';

export function unauthorized(res: Response, message?: string): void {
  error(res, 401, message ?? 'Unauthorized');
}
