import { Team } from '@prisma/client';
import { Router } from 'express';

import { Role } from '@bkr/api-interface';

import { BadRequestException, InternalServerErrorException } from '../errors';
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
      if (error) throw new BadRequestException(error.message);

      const { name, number, members } = value;

      let team: Team | null;

      try {
        team = await teamService.getTeamByNumber(number);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (team !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      try {
        team = await teamService.createTeam(name, number, members);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      res.status(201);
      res.json(team);
    })
  );

  router.get(
    '/teams',
    handler(async (req, res) => {
      let teams: Team[];

      try {
        teams = await teamService.getAll();
      } catch (err) {
        throw new InternalServerErrorException();
      }

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
      if (error) throw new BadRequestException(error.message);

      const { name, members, startedAt, finishedAt } = value;

      let team: Team | null;

      try {
        team = await teamService.getTeamById(teamId);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (team === null) {
        throw new BadRequestException(`Team ${teamId} does not exist`);
      }

      try {
        team = await teamService.updateTeam(teamId, {
          name,
          members,
          startedAt,
          finishedAt,
        });
      } catch (err) {
        throw new InternalServerErrorException();
      }

      res.status(200);
      res.json(team);
    })
  );

  router.delete(
    '/teams/:teamId',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      let team: Team | null;

      try {
        team = await teamService.getTeamById(teamId);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (team === null) {
        throw new BadRequestException(`Team ${teamId} does not exist`);
      }

      try {
        await teamService.deleteTeam(teamId);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      res.status(200);
      res.end();
    })
  );

  return router;
}
