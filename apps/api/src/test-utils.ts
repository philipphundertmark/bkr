import * as jwt from 'jsonwebtoken';

import { Role } from '@bkr/api-interface';

export type MockType<T, U extends keyof T = keyof T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in U]: T[K] extends (...args: any[]) => any
    ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>
    : T[K];
};

/**
 * Mocks an authorization header for an admin user
 * @returns {Authorization: string} - A valid authorization header for an admin user
 */
export const mockAuthorizationHeaderForAdmin = (): {
  Authorization: string;
} => {
  const token = jwt.sign(
    {
      sub: 'Admin',
      role: Role.ADMIN,
    },
    process.env.SECRET ?? '',
    {
      expiresIn: '5m',
    },
  );

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Mocks an authorization header for a station user
 * @returns {Authorization: string} - A valid authorization header for a station user
 */
export const mockAuthorizationHeaderForStation = (): {
  Authorization: string;
} => {
  const token = jwt.sign(
    {
      sub: '00000000-0000-0000-0000-000000000000',
      role: Role.STATION,
    },
    process.env.SECRET ?? '',
    {
      expiresIn: '5m',
    },
  );

  return {
    Authorization: `Bearer ${token}`,
  };
};
