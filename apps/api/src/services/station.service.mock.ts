import { Station } from '@prisma/client';

import { MockType } from '../mock-type';
import { StationService } from './station.service';

export const stationServiceMock: MockType<StationService> = {
  createStation: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  deleteStation: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getAll: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getStationByCode: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getStationById: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  getStationByNumber: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
  updateStation: jest.fn(async () => {
    throw new Error('Not implemented');
  }),
};

export const mockStation = (updates: Partial<Station>): Station => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'mock-station',
  number: 1,
  members: [],
  code: 'mock-code',
  ...updates,
});
