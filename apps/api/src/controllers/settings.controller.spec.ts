import axios from 'axios';
import http from 'http';

import { createApp } from '../app';
import { SettingsService } from '../services/settings.service';
import { settingsServiceMock } from '../services/settings.service.mock';
import { SettingsController } from './settings.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
const client = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => true,
});

const app = createApp([
  SettingsController(settingsServiceMock as unknown as SettingsService),
]);
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
