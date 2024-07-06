import { Router } from 'express';

import {
  CreateTeamSchema,
  Role,
  TeamUtils,
  UpdateTeamSchema,
} from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { authorize } from '../middleware/authorize';
import { ResultService } from '../services/result.service';
import { TeamService } from '../services/team.service';
import { handler } from './handler';

export function TeamController(
  resultService: ResultService,
  teamService: TeamService,
): Router {
  const router = Router();

  /**
   * @openapi
   *
   * /teams:
   *   post:
   *     description: Create a new team
   *     tags:
   *       - Team
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: The team to create
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTeamSchema'
   *     responses:
   *       201:
   *         description: The created team
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Team'
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
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InternalServerError'
   */
  router.post(
    '/teams',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = CreateTeamSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, help } = value;

      let team = await teamService.getTeamByNumber(number);

      if (team !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      team = await teamService.createTeam(name, number, members, help);

      res.status(201);
      res.json(TeamUtils.serialize(team));
    }),
  );

  /**
   * @openapi
   *
   * /teams:
   *   get:
   *     description: Get all teams
   *     tags:
   *       - Team
   *     responses:
   *       200:
   *         description: All teams
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Team'
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InternalServerError'
   */
  router.get(
    '/teams',
    handler(async (req, res) => {
      const teams = await teamService.getAll();

      res.status(200);
      res.json(teams.map(TeamUtils.serialize));
    }),
  );

  /**
   * @openapi
   *
   * /teams/shuffle:
   *   put:
   *     description: Shuffle teams
   *     tags:
   *       - Team
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: The updated teams
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Team'
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
   *         description: The team does not exist
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
    '/teams/shuffle',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const teams = await teamService.shuffleTeams();

      res.status(200);
      res.json(teams.map(TeamUtils.serialize));
    }),
  );

  /**
   * @openapi
   *
   * /teams/{teamId}:
   *   put:
   *     description: Update a team
   *     tags:
   *       - Team
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/teamId'
   *     requestBody:
   *       description: Team updates
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTeamSchema'
   *     responses:
   *       200:
   *         description: The updated team
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Team'
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
   *         description: The team does not exist
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
    '/teams/:teamId',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const teamId = req.params.teamId;

      const { value, error } = UpdateTeamSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, startedAt, finishedAt, help, penalty } =
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
        help,
        penalty,
      });

      res.status(200);
      res.json(TeamUtils.serialize(team));
    }),
  );

  /**
   * @openapi
   *
   * /teams/{teamId}:
   *   delete:
   *     description: Delete a team
   *     tags:
   *       - Team
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/teamId'
   *     responses:
   *       200:
   *         description: Successfully deleted the team
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
   *         description: The team does not exist
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
    }),
  );

  /**
   * @openapi
   *
   * /teams/{teamId}/results:
   *   delete:
   *     description: Delete all results of a team
   *     tags:
   *       - Team
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/teamId'
   *     responses:
   *       200:
   *         description: Successfully deleted all results of the team
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
   *         description: The team does not exist
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
    }),
  );

  return router;
}
