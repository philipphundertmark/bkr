/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Order, Station } from '@bkr/api-interface';

import { IStationService } from './station.service';

export const stationServiceMock = {
  createStation: jest.fn(async (...args) => {
    throw new Error('createStation not implemented');
  }),
  deleteStation: jest.fn(async (...args) => {
    throw new Error('deleteStation not implemented');
  }),
  getAll: jest.fn(async (...args) => {
    throw new Error('getAll not implemented');
  }),
  getStationByCode: jest.fn(async (...args) => {
    throw new Error('getStationByCode not implemented');
  }),
  getStationById: jest.fn(async (...args) => {
    throw new Error('getStationById not implemented');
  }),
  getStationByNumber: jest.fn(async (...args) => {
    throw new Error('getStationByNumber not implemented');
  }),
  updateStation: jest.fn(async (...args) => {
    throw new Error('updateStation not implemented');
  }),
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
