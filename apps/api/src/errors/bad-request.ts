import { Response } from 'express';

import { error } from './error';

export function badRequest(res: Response, message?: string): void {
  error(res, 400, message ?? 'Bad Request');
}

export class BadRequestException extends Error {
  constructor(message?: string) {
    super(message ?? 'Bad Request');
  }
}
