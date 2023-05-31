/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockType } from '../test-utils';
import { TokenService } from './token.service';

export const tokenServiceMock: MockType<TokenService> = {
  createToken: jest.fn((...args) => {
    throw new Error('Not implemented');
  }),
};
