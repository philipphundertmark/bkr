/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Order, Station } from '@bkr/api-interface';

import { IStationService } from './station.service';

export const stationServiceMock = {
  createStation: jest.fn(),
  deleteStation: jest.fn(),
  getAll: jest.fn(),
  getStationByCode: jest.fn(),
  getStationById: jest.fn(),
  getStationByNumber: jest.fn(),
  updateStation: jest.fn(),
} satisfies IStationService;

export const mockStation = (updates: Partial<Station>): Station => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: dayjs(),
  updatedAt: dayjs(),
  name: 'mock-station',
  number: 1,
  members: [],
  code: '000000',
  order: Order.ASC,
  ...updates,
});
