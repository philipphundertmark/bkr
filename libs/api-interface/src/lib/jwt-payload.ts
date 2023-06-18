import type { Role } from './role';

export interface JwtPayload {
  sub: string;
  role: Role;
  iat: number;
  exp: number;
}
