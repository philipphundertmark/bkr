import { MockType } from '../mock-type';
import { TokenService } from './token.service';

export function mockTokenService(): MockType<TokenService> {
  return {
    createToken: jest.fn(() => {
      throw new Error('Not implemented');
    }),
  };
}
