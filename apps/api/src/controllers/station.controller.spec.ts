import axios from 'axios';
import http from 'http';

import { createApp } from '../app';
import { StationService } from '../services/station.service';
import {
  mockStation,
  stationServiceMock,
} from '../services/station.service.mock';
import { StationController } from './station.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
const client = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => true,
});

const app = createApp([
  StationController(stationServiceMock as unknown as StationService),
]);
const server = http.createServer(app);

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

      const response = await client.get('/stations');

      expect(response.status).toEqual(200);
      expect(response.data).toEqual([]);
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

      const response = await client.get('/stations');

      expect(response.status).toEqual(200);
      expect(response.data).toHaveLength(stations.length);
    });
  });
});
