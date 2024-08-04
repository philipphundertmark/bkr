import { PrismaClient, Settings as PrismaSettings } from '@prisma/client';
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

export interface ISettingsService {
  /**
   * Update the settings with the specified updates.
   * If the settings do not exist, they will be created.
   *
   * @param updates - The updates to apply to the settings.
   */
  upsertSettings(updates?: { publishResults?: boolean }): Promise<Settings>;
}

export class SettingsService implements ISettingsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * @implements {ISettingsService}
   */
  async upsertSettings(
    updates: { publishResults?: boolean } = {},
  ): Promise<Settings> {
    let settings = await this.prisma.settings.findFirst();

    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          publishResults: updates.publishResults ?? false,
        },
      });
    } else {
      settings = await this.prisma.settings.update({
        where: {
          id: settings.id,
        },
        data: {
          publishResults: updates.publishResults,
        },
      });
    }

    return this.toSettings(settings);
  }

  /**
   * Converts settings read from the database to a settings object.
   *
   * @param settings - The settings read from the database.
   * @returns The settings object.
   */
  private toSettings(settings: PrismaSettings): Settings {
    return {
      ...settings,
      createdAt: dayjs(settings.createdAt),
      updatedAt: dayjs(settings.updatedAt),
    };
  }
}
