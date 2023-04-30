import superagent from 'superagent';
import prefix from 'superagent-prefix';

import { createServer } from '../server';
import { StationService } from '../services/station.service';
import {
  mockStation,
  stationServiceMock,
} from '../services/station.service.mock';
import { StationController } from './station.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);

const agent = superagent.agent();
agent.use(prefix(`http://localhost:${port}`));

const server = createServer([
  StationController(stationServiceMock as unknown as StationService),
]);

describe('StationController', () => {
  beforeAll(() => {
    server.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /stations', () => {
    it('returns no sessions', async () => {
      stationServiceMock.getAll.mockResolvedValueOnce([]);

      const response = await agent
        .get('/stations')
        .catch((err) => err.response);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it('returns all sessions', async () => {
      const stations = [
        mockStation({
          name: 'Station 1',
          number: 1,
        }),
        mockStation({
          name: 'Station 2',
          number: 2,
        }),
      ];

      stationServiceMock.getAll.mockResolvedValueOnce(stations);

      const response = await agent
        .get('/stations')
        .catch((err) => err.response);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(stations.length);
    });
  });
});
