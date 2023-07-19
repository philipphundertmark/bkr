import { PrismaClient, Settings as PrismaSettings } from '@prisma/client';
import dayjs from 'dayjs';

import { Settings } from '@bkr/api-interface';

export class SettingsService {
  constructor(private prisma: PrismaClient) {}

  async upsertSettings(
    updates: { publishResults?: boolean } = {}
  ): Promise<Settings> {
    // let settings = await this.prisma.settings.findFirst();

    const settings = await this.prisma.settings.upsert({
      where: {
        // id: settings?.id,
      },
      create: {
        publishResults: updates.publishResults ?? false,
      },
      update: {
        publishResults: updates.publishResults,
      },
    });

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
