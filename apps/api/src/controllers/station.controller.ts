import { Station } from '@prisma/client';
import { Router } from 'express';
import { SetOptional } from 'type-fest';

import { Role, isAdmin } from '@bkr/api-interface';

import { BadRequestException, InternalServerErrorException } from '../errors';
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
      if (error) throw new BadRequestException(error.message);

      const { name, number, members, code } = value;

      let station: SetOptional<Station, 'code'> | null;

      try {
        station = await stationService.getStationByNumber(number);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (station !== null) {
        throw new BadRequestException('"number" must be unique');
      }

      try {
        station = await stationService.getStationByCode(code);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (station !== null) {
        throw new BadRequestException('"code" must be unique');
      }

      try {
        station = await stationService.createStation(
          name,
          number,
          members,
          code
        );
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (!isAdmin(req.user)) {
        delete station.code;
      }

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
        throw new InternalServerErrorException();
      }

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
      if (error) throw new BadRequestException(error.message);

      const { name, number, members, code } = value;

      let station: SetOptional<Station, 'code'> | null;

      try {
        station = await stationService.getStationById(stationId);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (station === null) {
        throw new BadRequestException(`Station ${stationId} does not exist`);
      }

      try {
        station =
          typeof code !== 'undefined'
            ? await stationService.getStationByCode(code)
            : null;
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (typeof code !== 'undefined' && station !== null) {
        throw new BadRequestException('"code" must be unique');
      }

      try {
        station = await stationService.updateStation(stationId, {
          name: name,
          number: number,
          code: code,
          members: members,
        });
      } catch (err) {
        throw new InternalServerErrorException();
      }

      if (!isAdmin(req.user)) {
        delete station.code;
      }

      res.status(200);
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
        throw new InternalServerErrorException();
      }

      if (station === null) {
        throw new BadRequestException(`Station ${stationId} does not exist`);
      }

      try {
        await stationService.deleteStation(stationId);
      } catch (err) {
        throw new InternalServerErrorException();
      }

      res.status(200);
      res.end();
    })
  );

  return router;
}
