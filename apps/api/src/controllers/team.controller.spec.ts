import express from 'express';
import request from 'supertest';

import { TeamService } from '../services/team.service';
import { mockTeamService } from '../services/team.service.mock';
import { TeamController } from './team.controller';

const app = express();
app.use(TeamController(mockTeamService as unknown as TeamService));

describe('TeamController', () => {
  it('works', async () => {
    const response = await request(app).get('/not-found');
    expect(response.status).toEqual(404);
  });
});
