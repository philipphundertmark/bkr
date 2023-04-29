import type { Role } from './role';

export interface JwtPayload {
  sub: number;
  username: string;
  role: Role;
}
