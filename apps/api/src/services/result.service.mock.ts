/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockType } from '../test-utils';
import { ResultService } from './result.service';

export const resultServiceMock: MockType<ResultService> = {
  createResult: jest.fn((...args) => {
    throw new Error('Not implemented');
  }),
  deleteResult: jest.fn((...args) => {
    throw new Error('Not implemented');
  }),
  getResultById: jest.fn((...args) => {
    throw new Error('Not implemented');
  }),
  updateResult: jest.fn((...args) => {
    throw new Error('Not implemented');
  }),
};
