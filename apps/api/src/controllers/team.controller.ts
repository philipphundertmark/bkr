import { Router } from 'express';

import { Role } from '@bkr/api-interface';

import { BadRequestException } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateTeamSchema, UpdateTeamSchema } from '../schemas';
import { TeamService } from '../services/team.service';
import { handler } from './handler';

export function TeamController(teamService: TeamService): Router {
  const router = Router();

  router.post(
    '/teams',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = CreateTeamSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members } = value;

      let team = await teamService.getTeamByNumber(number);

      if (team !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      team = await teamService.createTeam(name, number, members);

      res.status(201);
      res.json(team);
    })
  );

  router.get(
    '/teams',
    handler(async (req, res) => {
      const teams = await teamService.getAll();

      res.status(200);
      res.json(teams);
    })
  );

  router.put(
    '/teams/:teamId',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      const { value, error } = UpdateTeamSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, members, startedAt, finishedAt } = value;

      let team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new BadRequestException(`Team ${teamId} does not exist`);
      }

      team = await teamService.updateTeam(teamId, {
        name,
        members,
        startedAt,
        finishedAt,
      });

      res.status(200);
      res.json(team);
    })
  );

  router.delete(
    '/teams/:teamId',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      const team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new BadRequestException(`Team ${teamId} does not exist`);
      }

      await teamService.deleteTeam(teamId);

      res.status(200);
      res.end();
    })
  );

  return router;
}
