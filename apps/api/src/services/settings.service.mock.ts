/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

import { MockType } from '../test-utils';
import { SettingsService } from './settings.service';

export const settingsServiceMock: MockType<SettingsService> = {
  upsertSettings: jest.fn((...args) => {
    throw new Error('upsertSettings not implemented');
  }),
};

export const mockSettings = (updates: Partial<Settings>): Settings => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: dayjs(),
  updatedAt: dayjs(),
  publishResults: false,
  ...updates,
});
