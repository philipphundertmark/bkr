import express from 'express';
import request from 'supertest';

import { StationService } from '../services/station.service';
import { mockStationService } from '../services/station.service.mock';
import { StationController } from './station.controller';

const app = express();
app.use(StationController(mockStationService as unknown as StationService));

describe('StationController', () => {
  it('works', async () => {
    const response = await request(app).get('/not-found');
    expect(response.status).toEqual(404);
  });
});
