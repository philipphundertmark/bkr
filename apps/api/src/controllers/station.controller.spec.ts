import axios from 'axios';
import http from 'http';

import { createApp } from '../app';
import { StationService } from '../services/station.service';
import {
  mockStation,
  stationServiceMock,
} from '../services/station.service.mock';
import {
  mockAuthorizationHeaderForAdmin,
  mockAuthorizationHeaderForStation,
} from '../test-utils';
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

  describe('POST /stations', () => {
    it('returns 400 if the request payload is invalid', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        }
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" is required',
      });
    });

    it("returns 400 if the station's code is already in use", async () => {
      stationServiceMock.getStationByCode.mockResolvedValueOnce(
        mockStation({
          name: 'Station 1',
          number: 1,
          code: '123456',
        })
      );

      const response = await client.post(
        '/stations',
        {
          name: 'Station 2',
          number: 2,
          code: '123456',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        }
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" must be unique',
      });
    });

    it("returns 400 if the station's number is already in use", async () => {
      stationServiceMock.getStationByCode.mockResolvedValueOnce(null);
      stationServiceMock.getStationByNumber.mockResolvedValueOnce(
        mockStation({
          name: 'Station 1',
          number: 1,
        })
      );

      const response = await client.post(
        '/stations',
        {
          name: 'Station 2',
          number: 1,
          code: '123456',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        }
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"number" must be unique',
      });
    });

    it('returns 401 if the user is not authenticated', async () => {
      const response = await client.post('/stations');

      expect(response.status).toEqual(401);
    });

    it('returns 403 if the user is not authorized', async () => {
      const response = await client.post(
        '/stations',
        {},
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(403);
    });
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
