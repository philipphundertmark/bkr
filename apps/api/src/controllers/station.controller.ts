import { Station } from '@prisma/client';
import { Router } from 'express';
import { SetOptional } from 'type-fest';

import { Role, isAdmin } from '@bkr/api-interface';

import { BadRequestException, NotFoundException } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateStationSchema, UpdateStationSchema } from '../schemas';
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
   *     requestBody:
   *       description: Station to create
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
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = CreateStationSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, code } = value;

      let station: SetOptional<Station, 'code'> | null =
        await stationService.getStationByNumber(number);

      if (station !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      station = await stationService.getStationByCode(code);

      if (station !== null) {
        throw new BadRequestException('"code" must be unique');
      }

      station = await stationService.createStation(name, number, members, code);

      res.status(201);
      res.json(station);
    })
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
      res.json(stations);
    })
  );

  router.put(
    '/stations/:stationId',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      const { value, error } = UpdateStationSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { name, number, members, code } = value;

      let station = await stationService.getStationById(stationId);

      if (station === null) {
        throw new NotFoundException(`Station ${stationId} does not exist`);
      }

      station =
        typeof code !== 'undefined'
          ? await stationService.getStationByCode(code)
          : null;

      if (typeof code !== 'undefined' && station !== null) {
        throw new BadRequestException('"code" must be unique');
      }

      station = await stationService.updateStation(stationId, {
        name: name,
        number: number,
        code: code,
        members: members,
      });

      res.status(200);
      res.json(station);
    })
  );

  router.delete(
    '/stations/:stationId',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      const station = await stationService.getStationById(stationId);

      if (station === null) {
        throw new NotFoundException(`Station ${stationId} does not exist`);
      }

      await stationService.deleteStation(stationId);

      res.status(200);
      res.end();
    })
  );

  return router;
}
