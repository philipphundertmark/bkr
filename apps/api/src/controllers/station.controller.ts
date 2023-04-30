import { Station } from '@prisma/client';
import { Router } from 'express';
import { SetOptional } from 'type-fest';

import { Role } from '@bkr/api-interface';

import { badRequest, internalServerError } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateStationSchema, UpdateStationSchema } from '../schemas';
import { StationService } from '../services/station.service';
import { handler } from './handler';

export function StationController(stationService: StationService): Router {
  const router = Router();

  router.post(
    '/stations',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const { value, error } = CreateStationSchema.validate(req.body);
      if (error) {
        return badRequest(res, error.message);
      }

      const { name, number, members, code } = value;

      let station: SetOptional<Station, 'code'> | null;

      try {
        station = await stationService.getStationByNumber(number);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (station !== null) {
        return badRequest(res, '"number" must be unique');
      }

      try {
        station = await stationService.getStationByCode(code);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (station !== null) {
        return badRequest(res, '"code" must be unique');
      }

      try {
        station = await stationService.createStation(
          name,
          number,
          members,
          code
        );
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      delete station.code;

      res.status(201);
      res.json(station);
    })
  );

  router.get(
    '/stations',
    handler(async (req, res) => {
      let stations: SetOptional<Station, 'code'>[];

      try {
        stations = await stationService.getAll();
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      stations.forEach((station) => delete station.code);

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
        return badRequest(res, error.message);
      }

      const { name, number, members, code } = value;

      let station: SetOptional<Station, 'code'> | null;

      try {
        station = await stationService.getStationById(stationId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (station === null) {
        return badRequest(res, `Station ${stationId} does not exist`);
      }

      try {
        station =
          typeof code !== 'undefined'
            ? await stationService.getStationByCode(code)
            : null;
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (typeof code !== 'undefined' && station !== null) {
        return badRequest(res, '"code" must be unique');
      }

      try {
        station = await stationService.updateStation(stationId, {
          name: name,
          number: number,
          code: code,
          members: members,
        });
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      delete station.code;

      res.json(station);
    })
  );

  router.delete(
    '/stations/:stationId',
    hasRole(Role.ADMIN),
    handler(async (req, res) => {
      const stationId = req.params.stationId;

      let station: Station | null;

      try {
        station = await stationService.getStationById(stationId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (station === null) {
        return badRequest(res, `Station ${stationId} does not exist`);
      }

      try {
        await stationService.deleteStation(stationId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      res.end();
    })
  );

  return router;
}
