import { Router } from 'express';

import { Role } from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateResultSchema, UpdateResultSchema } from '../schemas';
import { ResultService } from '../services/result.service';
import { TeamService } from '../services/team.service';
import { handler } from './handler';

export function ResultController(
  resultService: ResultService,
  teamService: TeamService
): Router {
  const router = Router();

  router.post(
    '/stations/:stationId/results',
    hasRole(Role.ADMIN, Role.STATION),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      const { value, error } = CreateResultSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { teamId } = value;

      const team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new NotFoundException(`Team ${teamId} does not exist`);
      }

      let result = await resultService.getResultById(stationId, teamId);

      if (result !== null) {
        throw new BadRequestException(
          `A result for team ${teamId} at station ${stationId} already exists`
        );
      }

      result = await resultService.createResult(stationId, teamId);

      res.status(201);
      res.json(result);
    })
  );

  router.put(
    '/stations/:stationId/results/:teamId',
    hasRole(Role.ADMIN, Role.STATION),
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
          `A result for team ${teamId} at station ${stationId} does not exist`
        );
      }

      result = await resultService.updateResult(stationId, teamId, {
        checkIn: checkIn,
        checkOut: checkOut,
        points: points,
      });

      res.status(200);
      res.json(result);
    })
  );

  router.delete(
    '/stations/:stationId/results/:teamId',
    hasRole(Role.ADMIN, Role.STATION),
    handler(async (req, res) => {
      const stationId = req.params.stationId;
      const teamId = req.params.teamId;

      const result = await resultService.getResultById(stationId, teamId);

      if (result === null) {
        throw new NotFoundException(
          `A result for team ${teamId} at station ${stationId} does not exist`
        );
      }

      await resultService.deleteResult(stationId, teamId);

      res.status(200);
      res.end();
    })
  );

  return router;
}
