import { Router } from 'express';

import {
  CreateResultSchema,
  ResultUtils,
  Role,
  UpdateResultSchema,
} from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { authorize } from '../middleware/authorize';
import { ILiveService } from '../services/live.service';
import { IResultService } from '../services/result.service';
import { IStationService } from '../services/station.service';
import { ITeamService } from '../services/team.service';
import { handler } from './handler';

export function ResultController(
  liveService: ILiveService,
  resultService: IResultService,
  stationService: IStationService,
  teamService: ITeamService,
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

      liveService.sendSetResultEvent(result);
    }),
  );

  router.get(
    '/results',
    handler(async (req, res) => {
      const results = await resultService.getAll();

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

      liveService.sendSetResultEvent(result);
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

      liveService.sendDeleteResultEvent(stationId, teamId);
    }),
  );

  return router;
}
