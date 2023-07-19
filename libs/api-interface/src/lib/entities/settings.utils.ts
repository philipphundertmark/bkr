import dayjs from 'dayjs';

import { Settings } from './settings';
import { SettingsDTO } from './settings.dto';

export const SettingsUtils = {
  deserialize(dto: SettingsDTO): Settings {
    return {
      id: dto.id,
      createdAt: dayjs(dto.createdAt),
      updatedAt: dayjs(dto.updatedAt),
      publishResults: dto.publishResults,
    };
  },
  serialize(settings: Settings): SettingsDTO {
    return {
      id: settings.id,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
      publishResults: settings.publishResults,
    };
  },
};
