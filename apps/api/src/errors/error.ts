import { Response } from 'express';

export function error(res: Response, status: number, message: string): void {
  res.status(status);
  res.json({
    message: message,
  });
}
