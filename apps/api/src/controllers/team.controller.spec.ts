import axios from 'axios';
import http from 'http';

import { createApp } from '../app';
import { ResultService } from '../services/result.service';
import { resultServiceMock } from '../services/result.service.mock';
import { TeamService } from '../services/team.service';
import { teamServiceMock } from '../services/team.service.mock';
import { TeamController } from './team.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
const client = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => true,
});

const app = createApp([
  TeamController(
    resultServiceMock as unknown as ResultService,
    teamServiceMock as unknown as TeamService,
  ),
]);
const server = http.createServer(app);

describe('TeamController', () => {
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
