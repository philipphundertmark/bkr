import { Router } from 'express';
import { SetOptional } from 'type-fest';

import { Station, StationUtils } from '@bkr/api-interface';
import {
  CreateStationSchema,
  Role,
  UpdateStationSchema,
  isAdmin,
} from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { authorize } from '../middleware/authorize';
import { StationService } from '../services/station.service';
import { handler } from './handler';

export function StationController(stationService: StationService): Router {
  const router = Router();

  /**
   * @openapi
   *
   * /stations:
   *   post:
   *     description: Create a new station
   *     tags:
   *       - Station
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: The station to create
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateStationSchema'
   *     responses:
   *       201:
   *         description: The created station
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Station'
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
    '/stations',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = CreateStationSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, code, order } = value;

      let station: SetOptional<Station, 'code'> | null =
        await stationService.getStationByNumber(number);

      if (station !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      station = await stationService.getStationByCode(code);

      if (station !== null) {
        throw new BadRequestException('"code" must be unique');
      }

      station = await stationService.createStation(
        name,
        number,
        members,
        code,
        order,
      );

      res.status(201);
      res.json(StationUtils.serialize(station));
    }),
  );

  /**
   * @openapi
   *
   * /stations:
   *   get:
   *     description: Get all stations
   *     tags:
   *       - Station
   *     responses:
   *       200:
   *         description: All stations
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Station'
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InternalServerError'
   */
  router.get(
    '/stations',
    handler(async (req, res) => {
      const stations: SetOptional<Station, 'code'>[] =
        await stationService.getAll();

      if (!isAdmin(req.user)) {
        stations.forEach((station) => delete station.code);
      }

      res.status(200);
      res.json(stations.map(StationUtils.serialize));
    }),
  );

  /**
   * @openapi
   *
   * /stations/{stationId}:
   *   put:
   *     description: Update a station
   *     tags:
   *       - Station
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/stationId'
   *     requestBody:
   *       description: Station updates
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateStationSchema'
   *     responses:
   *       200:
   *         description: The updated station
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Station'
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
   *         description: The station does not exist
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
    '/stations/:stationId',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      const { value, error } = UpdateStationSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, code, order } = value;

      let station = await stationService.getStationById(stationId);

      if (station === null) {
        throw new NotFoundException(`Station ${stationId} does not exist`);
      }

      station =
        typeof number !== 'undefined'
          ? await stationService.getStationByNumber(number)
          : null;

      if (
        typeof number !== 'undefined' &&
        station !== null &&
        stationId !== station.id
      ) {
        throw new BadRequestException('"number" must be unique');
      }

      station =
        typeof code !== 'undefined'
          ? await stationService.getStationByCode(code)
          : null;

      if (
        typeof code !== 'undefined' &&
        station !== null &&
        stationId !== station.id
      ) {
        throw new BadRequestException('"code" must be unique');
      }

      station = await stationService.updateStation(stationId, {
        name: name,
        number: number,
        code: code,
        members: members,
        order: order,
      });

      res.status(200);
      res.json(StationUtils.serialize(station));
    }),
  );

  /**
   * @openapi
   *
   * /stations/{stationId}:
   *   delete:
   *     description: Delete a station
   *     tags:
   *       - Station
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/stationId'
   *     responses:
   *       200:
   *         description: Successfully deleted the station
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
   *         description: The station does not exist
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
    '/stations/:stationId',
    authorize(Role.ADMIN),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      const station = await stationService.getStationById(stationId);

      if (station === null) {
        throw new NotFoundException(`Station ${stationId} does not exist`);
      }

      await stationService.deleteStation(stationId);

      res.status(200);
      res.end();
    }),
  );

  return router;
}
