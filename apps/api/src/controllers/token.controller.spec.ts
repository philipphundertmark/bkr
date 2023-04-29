import express from 'express';
import request from 'supertest';

import { StationService } from '../services/station.service';
import { mockStationService } from '../services/station.service.mock';
import { TokenService } from '../services/token.service';
import { mockTokenService } from '../services/token.service.mock';
import { TokenController } from './token.controller';

const app = express();
app.use(
  TokenController(
    mockTokenService as unknown as TokenService,
    mockStationService as unknown as StationService
  )
);

describe('TokenController', () => {
  it('works', async () => {
    const response = await request(app).get('/not-found');
    expect(response.status).toEqual(404);
    ``;
  });
});
