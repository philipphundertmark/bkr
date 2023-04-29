import { Response } from 'express';

import { error } from './error';

export function forbidden(res: Response, message?: string): void {
  error(res, 403, message ?? 'Forbidden');
}
