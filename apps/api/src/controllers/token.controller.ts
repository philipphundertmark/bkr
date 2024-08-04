import { Router } from 'express';

import { CreateTokenSchema, Role } from '@bkr/api-interface';

import { config } from '../config';
import { BadRequestException } from '../errors';
import { IStationService } from '../services/station.service';
import { ITokenService } from '../services/token.service';
import { handler } from './handler';

export function TokenController(
  stationService: IStationService,
  tokenService: ITokenService,
): Router {
  const router = Router();

  /**
   * @openapi
   *
   * /token:
   *   post:
   *     description: Create a token
   *     tags:
   *       - Token
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTokenSchema'
   *     responses:
   *       201:
   *         description: The created token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Token'
   *       400:
   *         description: Invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BadRequest'
   *       500:
   *         description: An unexpected error occurred
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/InternalServerError'
   */
  router.post(
    '/token',
    handler(async (req, res) => {
      const { value, error } = CreateTokenSchema.validate(req.body);

      if (error) {
        throw new BadRequestException(error.message);
      }

      const { code } = value;

      if (code === config.ADMIN_CODE) {
        const token = tokenService.createToken('Admin', Role.ADMIN);

        res.status(201);
        res.json({
          token: token,
        });

        return;
      }

      const station = await stationService.getStationByCode(code);

      if (station === null) {
        throw new BadRequestException('"code" is invalid');
      }

      const token = tokenService.createToken(station.id, Role.STATION);

      res.status(201);
      res.json({
        token: token,
      });
    }),
  );

  return router;
}
