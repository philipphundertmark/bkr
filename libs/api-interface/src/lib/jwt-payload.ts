import type { Role } from './role';

export interface JwtPayload {
  /**
   * The ID of the station if `role === Role.STATION` or 'Admin' if `role === Role.ADMIN`.
   */
  sub: string;

  /**
   * The role of the user.
   */
  role: Role;

  /**
   * The time the token was issued as a Unix timestamp.
   */
  iat: number;

  /**
   * The time the token expires as a Unix timestamp.
   */
  exp: number;
}
