import * as jwt from 'jsonwebtoken';

import { Role } from '@bkr/api-interface';

import { config } from '../config';

export interface ITokenService {
  /**
   * Creates a new token for the specified subject and role.
   * The token will expire in 7 days by default.
   */
  createToken(sub: string, role: Role, expiresIn?: string | number): string;
}

export class TokenService implements ITokenService {
  /**
   * @implements {ITokenService}
   */
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
