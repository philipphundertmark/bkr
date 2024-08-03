/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Result } from '@bkr/api-interface';

import { IResultService } from './result.service';

export const resultServiceMock = {
  createResult: jest.fn((...args) => {
    throw new Error('createResult not implemented');
  }),
  deleteResult: jest.fn((...args) => {
    throw new Error('deleteResult not implemented');
  }),
  deleteResultsByTeamId: jest.fn((...args) => {
    throw new Error('deleteResultsByTeamId not implemented');
  }),
  getAll: jest.fn((...args) => {
    throw new Error('getAll not implemented');
  }),
  getResultById: jest.fn((...args) => {
    throw new Error('getResultById not implemented');
  }),
  updateResult: jest.fn((...args) => {
    throw new Error('updateResult not implemented');
  }),
} satisfies IResultService;

export const mockResult = (updates: Partial<Result>): Result => ({
  stationId: '00000000-0000-0000-0000-000000000000',
  teamId: '00000000-0000-0000-0000-000000000000',
  checkIn: dayjs(),
  checkOut: dayjs(),
  points: 0,
  ...updates,
});
