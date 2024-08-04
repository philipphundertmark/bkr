/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Result } from '@bkr/api-interface';

import { IResultService } from './result.service';

export const resultServiceMock = {
  createResult: jest.fn(),
  deleteResult: jest.fn(),
  deleteResultsByTeamId: jest.fn(),
  getAll: jest.fn(),
  getResultById: jest.fn(),
  updateResult: jest.fn(),
} satisfies IResultService;

export const mockResult = (updates: Partial<Result>): Result => ({
  stationId: '00000000-0000-0000-0000-000000000000',
  teamId: '00000000-0000-0000-0000-000000000000',
  checkIn: dayjs(),
  checkOut: dayjs(),
  points: 0,
  ...updates,
});
