import express from 'express';
import request from 'supertest';

import { MockType } from '../mock-type';
import { StationService } from '../services/station.service';
import { mockStationService } from '../services/station.service.mock';
import { StationController } from './station.controller';

describe('StationController', () => {
  // App
  let app: express.Express;

  // Dependencies
  let stationServiceMock: MockType<StationService>;

  beforeEach(() => {
    stationServiceMock = mockStationService();

    app = express();
    app.use(StationController(stationServiceMock as unknown as StationService));
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
