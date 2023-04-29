import { JwtPayload } from '@bkr2022/api-interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
