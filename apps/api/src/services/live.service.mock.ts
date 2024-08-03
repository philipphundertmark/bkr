/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

import { ILiveService } from './live.service';

export const liveServiceMock = {
  sendDeleteResultEvent: jest.fn((...args) => {
    throw new Error('sendDeleteResultEvent not implemented');
  }),
  sendDeleteResultsOfTeamEvent: jest.fn((...args) => {
    throw new Error('sendDeleteResultsOfTeamEvent not implemented');
  }),
  sendDeleteStationEvent: jest.fn((...args) => {
    throw new Error('sendDeleteStationEvent not implemented');
  }),
  sendDeleteTeamEvent: jest.fn((...args) => {
    throw new Error('sendDeleteTeamEvent not implemented');
  }),
  sendSetResultEvent: jest.fn((...args) => {
    throw new Error('sendSetResultEvent not implemented');
  }),
  sendSetSettingsEvent: jest.fn((...args) => {
    throw new Error('sendSetSettingsEvent not implemented');
  }),
  sendSetStationEvent: jest.fn((...args) => {
    throw new Error('sendSetStationEvent not implemented');
  }),
  sendSetTeamEvent: jest.fn((...args) => {
    throw new Error('sendSetTeamEvent not implemented');
  }),
  sendSetTeamsEvent: jest.fn((...args) => {
    throw new Error('sendSetTeamsEvent not implemented');
  }),
} satisfies ILiveService;

export const mockSettings = (updates: Partial<Settings>): Settings => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: dayjs(),
  updatedAt: dayjs(),
  publishResults: false,
  ...updates,
});
