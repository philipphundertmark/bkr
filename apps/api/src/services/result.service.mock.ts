/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockType } from '../test-utils';
import { ResultService } from './result.service';

export const resultServiceMock: MockType<ResultService> = {
  createResult: jest.fn((...args) => {
    throw new Error('createResult not implemented');
  }),
  deleteResult: jest.fn((...args) => {
    throw new Error('deleteResult not implemented');
  }),
  getResultById: jest.fn((...args) => {
    throw new Error('getResultById not implemented');
  }),
  updateResult: jest.fn((...args) => {
    throw new Error('updateResult not implemented');
  }),
};
