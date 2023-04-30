import express from 'express';
import http from 'http';
import superagent from 'superagent';
import prefix from 'superagent-prefix';

import { TeamService } from '../services/team.service';
import { teamServiceMock } from '../services/team.service.mock';
import { TeamController } from './team.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);

const agent = superagent.agent();
agent.use(prefix(`http://localhost:${port}`));

const app = express();
const server = http.createServer(app);

app.use(TeamController(teamServiceMock as unknown as TeamService));

describe('TeamController', () => {
  beforeAll(() => {
    server.listen(port);
  });

  afterEach(() => {
    server.close();
  });

  it('works', async () => {
    const response = await agent.get('/not-found').catch((err) => err.response);
    expect(response.statusCode).toEqual(404);
  });
});
