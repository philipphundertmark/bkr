import { JwtPayload } from '@bkr/api-interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
