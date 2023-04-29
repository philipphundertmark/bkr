export const Role = {
  ADMIN: 'ADMIN',
  STATION: 'STATION',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
