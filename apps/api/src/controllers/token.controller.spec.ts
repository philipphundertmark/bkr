import axios from 'axios';
import express from 'express';
import http from 'http';

import { setupApp } from '../app';
import { StationService } from '../services/station.service';
import { stationServiceMock } from '../services/station.service.mock';
import { TokenService } from '../services/token.service';
import { tokenServiceMock } from '../services/token.service.mock';
import { TokenController } from './token.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
const client = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => true,
});

const app = express();
setupApp(app, [
  TokenController(
    stationServiceMock as unknown as StationService,
    tokenServiceMock as unknown as TokenService,
  ),
]);
const server = http.createServer(app);

describe('TokenController', () => {
  beforeAll(() => {
    server.listen(port);
  });

  afterEach(() => {
    server.close();
  });

  it('works', async () => {
    const response = await client.get('/not-found');

    expect(response.status).toEqual(404);
  });
});
