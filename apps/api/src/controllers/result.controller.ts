import { Router } from 'express';

import {
  CreateResultSchema,
  LiveEventType,
  ResultUtils,
  Role,
  UpdateResultSchema,
  isAdmin,
  isStation,
} from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { authorize } from '../middleware/authorize';
import { LiveService } from '../services/live.service';
import { ResultService } from '../services/result.service';
import { SettingsService } from '../services/settings.service';
import { StationService } from '../services/station.service';
import { TeamService } from '../services/team.service';
import { handler } from './handler';

export function ResultController(
  liveService: LiveService,
  resultService: ResultService,
  settingsService: SettingsService,
  stationService: StationService,
  teamService: TeamService,
): Router {
  const router = Router();

  router.post(
    '/stations/:stationId/results',
    authorize(Role.ADMIN, Role.STATION),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      const station = await stationService.getStationById(stationId);

      if (station === null) {
        throw new NotFoundException(`Station ${stationId} does not exist`);
      }

      const { value, error } = CreateResultSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { teamId } = value;

      const team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new BadRequestException(`Team ${teamId} does not exist`);
      }

      let result = await resultService.getResultById(stationId, teamId);

      if (result !== null) {
        throw new BadRequestException(
          `A result for team ${teamId} at station ${stationId} already exists`,
        );
      }

      result = await resultService.createResult(stationId, teamId);

      res.status(201);
      res.json(ResultUtils.serialize(result));

      liveService.sendEvent({
        type: LiveEventType.CREATE_RESULT,
        result,
      });
    }),
  );

  router.get(
    '/results',
    handler(async (req, res) => {
      const results = await resultService.getAll();
      const settings = await settingsService.upsertSettings();

      const isUser = !isAdmin(req.user) && !isStation(req.user);

      if (!settings.publishResults && isUser) {
        results.map((result) => ({
          ...result,
          // Disguise the points to users if the results are not published
          points: 0,
        }));
      }

      res.status(200);
      res.json(results.map(ResultUtils.serialize));
    }),
  );

  router.put(
    '/stations/:stationId/results/:teamId',
    authorize(Role.ADMIN, Role.STATION),
    handler(async (req, res) => {
      const stationId = req.params.stationId;
      const teamId = req.params.teamId;

      const { value, error } = UpdateResultSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { checkIn, checkOut, points } = value;

      let result = await resultService.getResultById(stationId, teamId);

      if (result === null) {
        throw new NotFoundException(
          `A result for team ${teamId} at station ${stationId} does not exist`,
        );
      }

      result = await resultService.updateResult(stationId, teamId, {
        checkIn: checkIn,
        checkOut: checkOut,
        points: points,
      });

      res.status(200);
      res.json(ResultUtils.serialize(result));

      liveService.sendEvent({
        type: LiveEventType.UPDATE_RESULT,
        result,
      });
    }),
  );

  router.delete(
    '/stations/:stationId/results/:teamId',
    authorize(Role.ADMIN, Role.STATION),
    handler(async (req, res) => {
      const stationId = req.params.stationId;
      const teamId = req.params.teamId;

      const result = await resultService.getResultById(stationId, teamId);

      if (result === null) {
        throw new NotFoundException(
          `A result for team ${teamId} at station ${stationId} does not exist`,
        );
      }

      await resultService.deleteResult(stationId, teamId);

      res.status(200);
      res.end();

      liveService.sendEvent({
        type: LiveEventType.DELETE_RESULT,
        stationId,
        teamId,
      });
    }),
  );

  return router;
}
