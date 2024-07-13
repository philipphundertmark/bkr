import { Router } from 'express';

import { Role, SettingsUtils, UpdateSettingsSchema } from '@bkr/api-interface';

import { BadRequestException } from '../errors';
import { authorize } from '../middleware/authorize';
import { LiveService } from '../services/live.service';
import { SettingsService } from '../services/settings.service';
import { handler } from './handler';

export function SettingsController(
  liveService: LiveService,
  settingsService: SettingsService,
): Router {
  const router = Router();

  router.get(
    '/settings',
    handler(async (req, res) => {
      const settings = await settingsService.upsertSettings();

      res.status(200);
      res.json(SettingsUtils.serialize(settings));
    }),
  );

  router.put(
    '/settings',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = UpdateSettingsSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { publishResults } = value;

      const settings = await settingsService.upsertSettings({ publishResults });

      res.status(200);
      res.json(SettingsUtils.serialize(settings));

      liveService.sendSetSettingsEvent(settings);
    }),
  );

  return router;
}
