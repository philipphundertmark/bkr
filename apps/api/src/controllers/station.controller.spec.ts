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
    it('creates a new station', async () => {
      const station = mockStation({
        name: 'Station 1',
        number: 1,
        members: [],
        code: '123456',
        order: 'ASC',
      });

      stationServiceMock.getStationByCode.mockResolvedValueOnce(null);
      stationServiceMock.getStationByNumber.mockResolvedValueOnce(null);
      stationServiceMock.createStation.mockResolvedValueOnce(station);

      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(201);
      expect(response.data).toEqual({
        ...station,
        createdAt: station.createdAt.toISOString(),
        updatedAt: station.updatedAt.toISOString(),
      });
    });

    it('returns 400 if the "name" is missing', async () => {
      const response = await client.post(
        '/stations',
        {
          number: 1,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"name" is required',
      });
    });

    it('returns 400 if the "name" is too short', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'St',
          number: 1,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"name" length must be at least 3 characters long',
      });
    });

    it('returns 400 if the "number" is missing', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"number" is required',
      });
    });

    it('returns 400 if the "number" is below the minimum', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 0,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"number" must be greater than or equal to 1',
      });
    });

    it('returns 400 if the "number" is already in use', async () => {
      stationServiceMock.getStationByCode.mockResolvedValueOnce(null);
      stationServiceMock.getStationByNumber.mockResolvedValueOnce(
        mockStation({
          name: 'Station 1',
          number: 1,
        }),
      );

      const response = await client.post(
        '/stations',
        {
          name: 'Station 2',
          number: 1,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"number" must be unique',
      });
    });

    it('returns 400 if the "code" is missing', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
          order: 'ASC',
          code: '123456',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"members" is required',
      });
    });

    it('returns 400 if the "code" is missing', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
          members: [],
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" is required',
      });
    });

    it('returns 400 if the "code" is too short', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
          members: [],
          code: '123',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" length must be 6 characters long',
      });
    });

    it('returns 400 if the "code" is already in use', async () => {
      stationServiceMock.getStationByCode.mockResolvedValueOnce(
        mockStation({
          name: 'Station 1',
          number: 1,
          code: '123456',
        }),
      );

      const response = await client.post(
        '/stations',
        {
          name: 'Station 2',
          number: 2,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" must be unique',
      });
    });

    it('returns 400 if the "order" is missing', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
          members: [],
          code: '123456',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"order" is required',
      });
    });

    it('returns 400 if the "order" is invalid', async () => {
      const response = await client.post(
        '/stations',
        {
          name: 'Station 1',
          number: 1,
          members: [],
          code: '123456',
          order: 'INVALID',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"order" must be one of [ASC, DESC]',
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
        },
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

    it('returns all sessions with "code" for admin users', async () => {
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

      const response = await client.get('/stations', {
        headers: mockAuthorizationHeaderForAdmin(),
      });

      expect(response.status).toEqual(200);
      expect(response.data).toHaveLength(stations.length);
      expect(response.data[0]).toHaveProperty('code');
      expect(response.data[1]).toHaveProperty('code');
    });

    it('returns all sessions without "code" for station users', async () => {
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

      const response = await client.get('/stations', {
        headers: mockAuthorizationHeaderForStation(),
      });

      expect(response.status).toEqual(200);
      expect(response.data).toHaveLength(stations.length);
      expect(response.data[0]).not.toHaveProperty('code');
      expect(response.data[1]).not.toHaveProperty('code');
    });

    it('returns all sessions without "code" for default users', async () => {
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
      expect(response.data[0]).not.toHaveProperty('code');
      expect(response.data[1]).not.toHaveProperty('code');
    });

    it('returns 500 if an unexpected error occurs', async () => {
      stationServiceMock.getAll.mockRejectedValueOnce(new Error());

      const response = await client.get('/stations');

      expect(response.status).toEqual(500);
    });
  });

  describe('PUT /stations/:stationId', () => {
    it('returns the updated station', async () => {
      const station = mockStation({
        name: 'Station 1',
        number: 1,
      });

      stationServiceMock.getStationById.mockResolvedValueOnce(station);
      stationServiceMock.getStationByNumber.mockResolvedValueOnce(null);
      stationServiceMock.getStationByCode.mockResolvedValueOnce(null);
      stationServiceMock.updateStation.mockResolvedValueOnce(station);

      const response = await client.put(
        '/stations/1',
        {
          name: 'Station 1',
          number: 1,
          members: [],
          code: '123456',
          order: 'ASC',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(200);
      expect(response.data).toEqual({
        ...station,
        createdAt: station.createdAt.toISOString(),
        updatedAt: station.updatedAt.toISOString(),
      });
    });

    it('returns 400 if the "name" is too short', async () => {
      const response = await client.put(
        '/stations/1',
        {
          name: 'St',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"name" length must be at least 3 characters long',
      });
    });

    it('returns 400 if the "number" is below the minimum', async () => {
      const response = await client.put(
        '/stations/1',
        {
          number: 0,
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"number" must be greater than or equal to 1',
      });
    });

    it('returns 400 if the "number" is already in use', async () => {
      stationServiceMock.getStationById.mockResolvedValueOnce(
        mockStation({
          name: 'Station 1',
          number: 1,
        }),
      );
      stationServiceMock.getStationByNumber.mockResolvedValueOnce(
        mockStation({
          name: 'Station 2',
          number: 1,
        }),
      );

      const response = await client.put(
        '/stations/1',
        {
          number: 1,
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"number" must be unique',
      });
    });

    it('returns 400 if the "code" is too short', async () => {
      const response = await client.put(
        '/stations/1',
        {
          code: '123',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" length must be 6 characters long',
      });
    });

    it('returns 400 if the "code" is already in use', async () => {
      stationServiceMock.getStationById.mockResolvedValueOnce(
        mockStation({
          name: 'Station 1',
          number: 1,
        }),
      );
      stationServiceMock.getStationByCode.mockResolvedValueOnce(
        mockStation({
          name: 'Station 2',
          number: 2,
          code: '123456',
        }),
      );

      const response = await client.put(
        '/stations/1',
        {
          code: '123456',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"code" must be unique',
      });
    });

    it('returns 400 if the "order" is invalid', async () => {
      const response = await client.put(
        '/stations/1',
        {
          order: 'INVALID',
        },
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"order" must be one of [ASC, DESC]',
      });
    });

    it('returns 401 if the user is not authenticated', async () => {
      const response = await client.put('/stations/1');

      expect(response.status).toEqual(401);
    });

    it('returns 403 if the user is not authorized', async () => {
      const response = await client.put(
        '/stations/1',
        {},
        {
          headers: mockAuthorizationHeaderForStation(),
        },
      );

      expect(response.status).toEqual(403);
    });

    it('returns 404 if the station does not exist', async () => {
      stationServiceMock.getStationById.mockResolvedValueOnce(null);

      const response = await client.put(
        '/stations/1',
        {},
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(404);
    });

    it('returns 500 if an unexpected error occurs', async () => {
      stationServiceMock.getStationById.mockRejectedValueOnce(new Error());

      const response = await client.put(
        '/stations/1',
        {},
        {
          headers: mockAuthorizationHeaderForAdmin(),
        },
      );

      expect(response.status).toEqual(500);
    });
  });

  describe('DELETE /stations/:stationId', () => {
    it('deletes the station', async () => {
      const station = mockStation({
        name: 'Station 1',
        number: 1,
      });

      stationServiceMock.getStationById.mockResolvedValueOnce(station);
      stationServiceMock.deleteStation.mockResolvedValueOnce();

      const response = await client.delete('/stations/1', {
        headers: mockAuthorizationHeaderForAdmin(),
      });

      expect(response.status).toEqual(200);
    });

    it('returns 401 if the user is not authenticated', async () => {
      const response = await client.delete('/stations/1');

      expect(response.status).toEqual(401);
    });

    it('returns 403 if the user is not authorized', async () => {
      const response = await client.delete('/stations/1', {
        headers: mockAuthorizationHeaderForStation(),
      });

      expect(response.status).toEqual(403);
    });

    it('returns 404 if the station does not exist', async () => {
      stationServiceMock.getStationById.mockResolvedValueOnce(null);

      const response = await client.delete('/stations/1', {
        headers: mockAuthorizationHeaderForAdmin(),
      });

      expect(response.status).toEqual(404);
    });

    it('returns 500 if an unexpected error occurs', async () => {
      stationServiceMock.getStationById.mockRejectedValueOnce(new Error());

      const response = await client.delete('/stations/1', {
        headers: mockAuthorizationHeaderForAdmin(),
      });

      expect(response.status).toEqual(500);
    });
  });
});
