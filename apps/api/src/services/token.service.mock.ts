import { MockType } from '../test-utils';
import { TokenService } from './token.service';

export const tokenServiceMock: MockType<TokenService> = {
  createToken: jest.fn(() => {
    throw new Error('Not implemented');
  }),
};
