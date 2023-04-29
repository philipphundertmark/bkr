import { Team } from '@prisma/client';
import { Router } from 'express';

import { Role } from '@bkr/api-interface';

import { badRequest, internalServerError } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateTeamSchema, UpdateTeamSchema } from '../schemas';
import { TeamService } from '../services/team.service';

export function TeamController(teamService: TeamService): Router {
  const router = Router();

  router.post('/teams', hasRole(Role.ADMIN), async (req, res) => {
    const { value, error } = CreateTeamSchema.validate(req.body);
    if (error) {
      return badRequest(res, error.message);
    }

    const { name, number, members } = value;

    let team: Team | null;

    try {
      team = await teamService.getTeamByNumber(number);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (team !== null) {
      return badRequest(res, '"number" must be unique');
    }

    try {
      team = await teamService.createTeam(name, number, members);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.status(201);
    res.json(team);
  });

  router.get('/teams', async (req, res) => {
    let teams: Team[];

    try {
      teams = await teamService.getAll();
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.json(teams);
  });

  router.put('/teams/:teamId', hasRole(Role.ADMIN), async (req, res) => {
    const { value, error } = UpdateTeamSchema.validate(req.body);
    if (error) {
      return badRequest(res, error.message);
    }

    const { name, members, startedAt, finishedAt } = value;

    const teamId = req.params.teamId;

    let team: Team | null;

    try {
      team = await teamService.getTeamById(teamId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (team === null) {
      return badRequest(res, `Team ${teamId} does not exist`);
    }

    try {
      team = await teamService.updateTeam(teamId, {
        name,
        members,
        startedAt,
        finishedAt,
      });
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.json(team);
  });

  router.delete('/teams/:teamId', hasRole(Role.ADMIN), async (req, res) => {
    const teamId = req.params.teamId;

    let team: Team | null;

    try {
      team = await teamService.getTeamById(teamId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (team === null) {
      return badRequest(res, `Team ${teamId} does not exist`);
    }

    try {
      await teamService.deleteTeam(teamId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.end();
  });

  return router;
}
