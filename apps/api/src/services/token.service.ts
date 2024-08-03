import * as jwt from 'jsonwebtoken';

import { Role } from '@bkr/api-interface';

import { config } from '../config';

export interface ITokenService {
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
