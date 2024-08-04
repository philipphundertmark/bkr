/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITokenService } from './token.service';

export const tokenServiceMock = {
  createToken: jest.fn(),
} satisfies ITokenService;
