import { Router } from 'express';

import {
  CreateTeamSchema,
  Role,
  ScheduleTeamsSchema,
  TeamUtils,
  UpdateTeamSchema,
} from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { authorize } from '../middleware/authorize';
import { LiveService } from '../services/live.service';
import { ResultService } from '../services/result.service';
import { TeamService } from '../services/team.service';
import { handler } from './handler';

export function TeamController(
  liveService: LiveService,
  resultService: ResultService,
  teamService: TeamService,
): Router {
  const router = Router();

  router.post(
    '/teams',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = CreateTeamSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, ranking } = value;

      let team = await teamService.getTeamByNumber(number);

      if (team !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      team = await teamService.createTeam(name, number, members, ranking);

      res.status(201);
      res.json(TeamUtils.serialize(team));

      liveService.sendSetTeamEvent(team);
    }),
  );

  router.get(
    '/teams',
    handler(async (req, res) => {
      const teams = await teamService.getAll();

      res.status(200);
      res.json(teams.map(TeamUtils.serialize));
    }),
  );

  router.put(
    '/teams/schedule',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = ScheduleTeamsSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { start, interval } = value;

      const teams = await teamService.scheduleTeams(start, interval);

      res.status(200);
      res.json(teams.map(TeamUtils.serialize));

      liveService.sendSetTeamsEvent(teams);
    }),
  );

  router.put(
    '/teams/:teamId',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      const { value, error } = UpdateTeamSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, startedAt, finishedAt, ranking, penalty } =
        value;

      let team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new NotFoundException(`Team ${teamId} does not exist`);
      }

      team =
        typeof number !== 'undefined'
          ? await teamService.getTeamByNumber(number)
          : null;

      if (
        typeof number !== 'undefined' &&
        team !== null &&
        teamId !== team.id
      ) {
        throw new BadRequestException('"number" must be unique');
      }

      team = await teamService.updateTeam(teamId, {
        name,
        number,
        members,
        startedAt,
        finishedAt,
        ranking,
        penalty,
      });

      res.status(200);
      res.json(TeamUtils.serialize(team));

      liveService.sendSetTeamEvent(team);
    }),
  );

  router.delete(
    '/teams/:teamId',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      const team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new NotFoundException(`Team ${teamId} does not exist`);
      }

      await teamService.deleteTeam(teamId);

      res.status(200);
      res.end();

      liveService.sendDeleteTeamEvent(teamId);
    }),
  );

  router.delete(
    '/teams/:teamId/results',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      const team = await teamService.getTeamById(teamId);

      if (team === null) {
        throw new NotFoundException(`Team ${teamId} does not exist`);
      }

      await resultService.deleteResultsByTeamId(teamId);

      res.status(200);
      res.end();

      liveService.sendDeleteResultsOfTeamEvent(teamId);
    }),
  );

  return router;
}
