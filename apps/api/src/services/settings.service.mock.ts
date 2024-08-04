/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

import { ISettingsService } from './settings.service';

export const settingsServiceMock = {
  upsertSettings: jest.fn(),
} satisfies ISettingsService;

export const mockSettings = (updates: Partial<Settings>): Settings => ({
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: dayjs(),
  updatedAt: dayjs(),
  publishResults: false,
  ...updates,
});
