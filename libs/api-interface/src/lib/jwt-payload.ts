import type { Role } from './role';

export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
}
