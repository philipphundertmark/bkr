import axios from 'axios';
import express from 'express';
import http from 'http';

import { setupApp } from '../app';
import { liveServiceMock } from '../services/live.service.mock';
import { settingsServiceMock } from '../services/settings.service.mock';
import { SettingsController } from './settings.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
const client = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => true,
});

const app = express();
setupApp(app, [SettingsController(liveServiceMock, settingsServiceMock)]);
const server = http.createServer(app);

describe('SettingsController', () => {
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
