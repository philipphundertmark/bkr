import { PrismaClient, Settings as PrismaSettings } from '@prisma/client';
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

export class SettingsService {
  constructor(private prisma: PrismaClient) {}

  async upsertSettings(
    updates: { publishResults?: boolean } = {}
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

  private toSettings(settings: PrismaSettings): Settings {
    return {
      ...settings,
      createdAt: dayjs(settings.createdAt),
      updatedAt: dayjs(settings.updatedAt),
    };
  }
}
