import express from 'express';
import request from 'supertest';

import { MockType } from '../mock-type';
import { TeamService } from '../services/team.service';
import { mockTeamService } from '../services/team.service.mock';
import { TeamController } from './team.controller';

describe('TeamController', () => {
  // App
  let app: express.Express;

  // Dependencies
  let teamServiceMock: MockType<TeamService>;

  beforeEach(() => {
    teamServiceMock = mockTeamService();

    app = express();
    app.use(TeamController(teamServiceMock as unknown as TeamService));
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
