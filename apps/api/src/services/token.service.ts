import * as jwt from 'jsonwebtoken';

import { Role } from '@bkr/api-interface';

import { config } from '../config';

export class TokenService {
  createToken(
    sub: number,
    username: string,
    role: Role,
    expiresIn: string | number = '1d'
  ): string {
    return jwt.sign(
      {
        sub: sub,
        username: username,
        role: role,
      },
      config.SECRET,
      {
        expiresIn: expiresIn,
      }
    );
  }
}
