import { Router } from 'express';

import {
  CreateResultSchema,
  ResultUtils,
  Role,
  UpdateResultSchema,
} from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { authorize } from '../middleware/authorize';
import { ResultService } from '../services/result.service';
import { StationService } from '../services/station.service';
import { TeamService } from '../services/team.service';
import { handler } from './handler';

export function ResultController(
  resultService: ResultService,
  stationService: StationService,
  teamService: TeamService,
): Router {
  const router = Router();

  /**
   * @openapi
   *
   * /stations/{stationId}/results:
   *   post:
   *     description: Create a new result
   *     tags:
   *       - Result
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/stationId'
   *     requestBody:
   *       description: The result to create
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateResultSchema'
   *     responses:
   *       201:
   *         description: The created result
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Result'
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
    }),
  );

  /**
   * @openapi
   *
   * /stations/{stationId}/results/{teamId}:
   *   put:
   *     description: Update a result
   *     tags:
   *       - Result
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/stationId'
   *       - $ref: '#/components/parameters/teamId'
   *     requestBody:
   *       description: Result updates
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateResultSchema'
   *     responses:
   *       200:
   *         description: The updated result
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Result'
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
   *         description: The result does not exist
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
    }),
  );

  /**
   * @openapi
   *
   * /stations/{stationId}/results/{teamId}:
   *   delete:
   *     description: Delete a result
   *     tags:
   *       - Result
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/stationId'
   *       - $ref: '#/components/parameters/teamId'
   *     responses:
   *       200:
   *         description: Successfully deleted the result
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
   *         description: The result does not exist
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
    }),
  );

  return router;
}
