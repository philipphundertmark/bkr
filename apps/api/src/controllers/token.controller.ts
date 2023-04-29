import { Station } from '@prisma/client';
import { Router } from 'express';

import { Role } from '@bkr/api-interface';

import { config } from '../config';
import { badRequest, internalServerError } from '../errors';
import { CreateTokenSchema } from '../schemas';
import { StationService } from '../services/station.service';
import { TokenService } from '../services/token.service';
import { handler } from './handler';

export function TokenController(
  tokenService: TokenService,
  stationService: StationService
): Router {
  const router = Router();

  router.post(
    '/token',
    handler(async (req, res) => {
      const { value, error } = CreateTokenSchema.validate(req.body);
      if (error) {
        return badRequest(res, error.message);
      }

      const { code } = value;

      if (code === config.ADMIN_CODE) {
        const token = tokenService.createToken('Admin', 'Admin', Role.ADMIN);

        res.status(201);
        res.json({
          token: token,
        });

        return;
      }

      let station: Station | null;

      try {
        station = await stationService.getStationByCode(code);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (station === null) {
        return badRequest(res, '"code" is invalid');
      }

      const token = tokenService.createToken(
        station.id,
        `Station ${station.id}`,
        Role.STATION
      );

      res.status(201);
      res.json({
        token: token,
      });
    })
  );

  return router;
}
