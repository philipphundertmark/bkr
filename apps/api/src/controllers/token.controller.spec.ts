import superagent from 'superagent';
import prefix from 'superagent-prefix';

import { createServer } from '../server';
import { StationService } from '../services/station.service';
import { stationServiceMock } from '../services/station.service.mock';
import { TokenService } from '../services/token.service';
import { tokenServiceMock } from '../services/token.service.mock';
import { TokenController } from './token.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);

const agent = superagent.agent();
agent.use(prefix(`http://localhost:${port}`));

const server = createServer([
  TokenController(
    tokenServiceMock as unknown as TokenService,
    stationServiceMock as unknown as StationService
  ),
]);

describe('TokenController', () => {
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
