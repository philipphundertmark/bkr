/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITokenService } from './token.service';

export const tokenServiceMock = {
  createToken: jest.fn((...args) => {
    throw new Error('createToken not implemented');
  }),
} satisfies ITokenService;
