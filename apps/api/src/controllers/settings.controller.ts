import { Router } from 'express';

import { Role, SettingsUtils, UpdateSettingsSchema } from '@bkr/api-interface';

import { BadRequestException } from '../errors';
import { authorize } from '../middleware/authorize';
import { SettingsService } from '../services/settings.service';
import { handler } from './handler';

export function SettingsController(settingsService: SettingsService): Router {
  const router = Router();

  /**
   * @openapi
   *
   * /settings:
   *   get:
   *     description: Get the current settings
   *     tags:
   *       - Settings
   *     responses:
   *       200:
   *         description: The current settings
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Settings'
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InternalServerError'
   */
  router.get(
    '/settings',
    handler(async (req, res) => {
      const settings = await settingsService.upsertSettings();

      res.status(200);
      res.json(SettingsUtils.serialize(settings));
    }),
  );

  /**
   * @openapi
   *
   * /settings:
   *   put:
   *     description: Update the settings
   *     tags:
   *       - Settings
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: Settings updates
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateSettingsSchema'
   *     responses:
   *       200:
   *         description: The updated settings
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Settings'
   *       400:
   *         description: Invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BadRequest'
   *       401:
   *         description: You are not authenticated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Unauthorized'
   *       403:
   *         description: You are not authorized to access this resource
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Forbidden'
   *       404:
   *         description: The settings does not exist
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NotFound'
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InternalServerError'
   */
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
    }),
  );

  return router;
}
