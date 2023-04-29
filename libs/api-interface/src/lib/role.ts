export const Role = {
  ADMIN: 'ADMIN',
  STATION: 'STATION',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export function isRole(role: string): role is Role {
  return role === Role.ADMIN || role === Role.STATION;
}
