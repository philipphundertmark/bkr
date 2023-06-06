// import axios from 'axios';
import http from 'http';

import { createApp } from '../app';
import { ResultService } from '../services/result.service';
import { resultServiceMock } from '../services/result.service.mock';
import { TeamService } from '../services/team.service';
import { teamServiceMock } from '../services/team.service.mock';
import { ResultController } from './result.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
// const client = axios.create({
//   baseURL: `http://localhost:${port}`,
//   validateStatus: () => true,
// });

const app = createApp([
  ResultController(
    resultServiceMock as unknown as ResultService,
    teamServiceMock as unknown as TeamService
  ),
]);
const server = http.createServer(app);

describe('ResultController', () => {
  beforeAll(() => {
    server.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  it('should work', () => {
    expect(true).toEqual(true);
  });
});
