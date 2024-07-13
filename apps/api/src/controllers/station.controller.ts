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
import { LiveService } from '../services/live.service';
import { StationService } from '../services/station.service';
import { handler } from './handler';

export function StationController(
  liveService: LiveService,
  stationService: StationService,
): Router {
  const router = Router();

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

      liveService.sendSetStationEvent(station);
    }),
  );

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

      liveService.sendSetStationEvent(station);
    }),
  );

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

      liveService.sendDeleteStationEvent(stationId);
    }),
  );

  return router;
}
