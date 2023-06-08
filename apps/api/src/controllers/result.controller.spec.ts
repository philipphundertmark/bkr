import axios from 'axios';
import http from 'http';

import { createApp } from '../app';
import { ResultService } from '../services/result.service';
import { mockResult, resultServiceMock } from '../services/result.service.mock';
import { StationService } from '../services/station.service';
import {
  mockStation,
  stationServiceMock,
} from '../services/station.service.mock';
import { TeamService } from '../services/team.service';
import { mockTeam, teamServiceMock } from '../services/team.service.mock';
import { mockAuthorizationHeaderForStation } from '../test-utils';
import { ResultController } from './result.controller';

const port = 3000 + Number(process.env.JEST_WORKER_ID);
const client = axios.create({
  baseURL: `http://localhost:${port}`,
  validateStatus: () => true,
});

const app = createApp([
  ResultController(
    resultServiceMock as unknown as ResultService,
    stationServiceMock as unknown as StationService,
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

  describe('POST /stations/:stationId/results', () => {
    it('creates a new result as an admin', async () => {
      const result = mockResult({});
      const station = mockStation({});
      const team = mockTeam({});

      resultServiceMock.createResult.mockResolvedValueOnce(result);
      resultServiceMock.getResultById.mockResolvedValueOnce(null);
      stationServiceMock.getStationById.mockResolvedValueOnce(station);
      teamServiceMock.getTeamById.mockResolvedValueOnce(team);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: '00000000-0000-0000-0000-000000000000',
        },
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(201);
      expect(response.data).toEqual({
        ...result,
        checkIn: result.checkIn.toISOString(),
        checkOut: result.checkOut?.toISOString() ?? null,
      });
    });

    it('creates a new result as a station', async () => {
      const result = mockResult({});
      const station = mockStation({});
      const team = mockTeam({});

      resultServiceMock.createResult.mockResolvedValueOnce(result);
      resultServiceMock.getResultById.mockResolvedValueOnce(null);
      stationServiceMock.getStationById.mockResolvedValueOnce(station);
      teamServiceMock.getTeamById.mockResolvedValueOnce(team);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: '00000000-0000-0000-0000-000000000000',
        },
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(201);
      expect(response.data).toEqual({
        ...result,
        checkIn: result.checkIn.toISOString(),
        checkOut: result.checkOut?.toISOString() ?? null,
      });
    });

    it('returns 400 if the "teamId" is missing', async () => {
      const station = mockStation({});

      stationServiceMock.getStationById.mockResolvedValueOnce(station);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {},
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"teamId" is required',
      });
    });

    it('returns 400 if the "teamId" is invalid', async () => {
      const station = mockStation({});

      stationServiceMock.getStationById.mockResolvedValueOnce(station);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: 'invalid',
        },
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: '"teamId" must be a valid GUID',
      });
    });

    it('returns 400 if the team with the given "teamId" does not exist', async () => {
      const station = mockStation({});

      stationServiceMock.getStationById.mockResolvedValueOnce(station);
      teamServiceMock.getTeamById.mockResolvedValueOnce(null);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: '00000000-0000-0000-0000-000000000000',
        },
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(400);
      expect(response.data).toEqual({
        error: 'Team 00000000-0000-0000-0000-000000000000 does not exist',
      });
    });

    it('returns 400 if the result already exists', async () => {
      const result = mockResult({});
      const station = mockStation({});
      const team = mockTeam({});

      resultServiceMock.getResultById.mockResolvedValueOnce(result);
      stationServiceMock.getStationById.mockResolvedValueOnce(station);
      teamServiceMock.getTeamById.mockResolvedValueOnce(team);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: '00000000-0000-0000-0000-000000000000',
        },
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(400);
    });

    it('returns 401 if the user is not authenticated', async () => {
      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: '00000000-0000-0000-0000-000000000000',
        }
      );

      expect(response.status).toEqual(401);
    });

    it('returns 404 if the station does not exist', async () => {
      stationServiceMock.getStationById.mockResolvedValueOnce(null);

      const response = await client.post(
        '/stations/00000000-0000-0000-0000-000000000000/results',
        {
          teamId: '00000000-0000-0000-0000-000000000000',
        },
        {
          headers: mockAuthorizationHeaderForStation(),
        }
      );

      expect(response.status).toEqual(404);
      expect(response.data).toEqual({
        error: 'Station 00000000-0000-0000-0000-000000000000 does not exist',
      });
    });
  });
});
