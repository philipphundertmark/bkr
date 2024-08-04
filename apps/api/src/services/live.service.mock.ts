/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

import { ILiveService } from './live.service';

export const liveServiceMock = {
  sendDeleteResultEvent: jest.fn(),
  sendDeleteResultsOfTeamEvent: jest.fn(),
  sendDeleteStationEvent: jest.fn(),
  sendDeleteTeamEvent: jest.fn(),
  sendSetResultEvent: jest.fn(),
  sendSetSettingsEvent: jest.fn(),
  sendSetStationEvent: jest.fn(),
  sendSetTeamEvent: jest.fn(),
  sendSetTeamsEvent: jest.fn(),
} satisfies ILiveService;

export const mockSettings = (updates: Partial<Settings>): Settings => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: dayjs(),
  updatedAt: dayjs(),
  publishResults: false,
  ...updates,
});
