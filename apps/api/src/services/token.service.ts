import * as jwt from 'jsonwebtoken';

import { Role } from '@bkr/api-interface';

import { config } from '../config';

export class TokenService {
  createToken(
    sub: string,
    role: Role,
    expiresIn: string | number = '7d',
  ): string {
    return jwt.sign(
      {
        sub: sub,
        role: role,
      },
      config.SECRET,
      {
        expiresIn: expiresIn,
      },
    );
  }
}
