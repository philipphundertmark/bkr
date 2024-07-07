import { JwtPayload } from './jwt-payload';

export const Role = {
  ADMIN: 'ADMIN',
  STATION: 'STATION',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export function isAdmin(jwtPayload?: JwtPayload): boolean {
  return jwtPayload?.role === Role.ADMIN;
}

export function isStation(jwtPayload?: JwtPayload): boolean {
  return jwtPayload?.role === Role.STATION;
}
