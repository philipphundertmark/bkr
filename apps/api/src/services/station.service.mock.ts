import { MockType } from '../mock-type';
import { StationService } from './station.service';

export function mockStationService(): MockType<StationService> {
  return {
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
}
