import { PrismaClient, Result as PrismaResult } from '@prisma/client';
import dayjs from 'dayjs';

import { Result } from '@bkr/api-interface';

export interface IResultService {
  /**
   * Creates a new result for the specified station and team.
   *
   * @param stationId - The ID of the station.
   * @param teamId - The ID of the team.
   */
  createResult(stationId: string, teamId: string): Promise<Result>;

  /**
   * Deletes the result of the specified station and team.
   *
   * @param stationId - The ID of the station.
   * @param teamId - The ID of the team.
   */
  deleteResult(stationId: string, teamId: string): Promise<void>;

  /**
   * Deletes all results of the specified team.
   *
   * @param teamId - The ID of the team.
   */
  deleteResultsByTeamId(teamId: string): Promise<void>;

  /**
   * Returns all results.
   */
  getAll(): Promise<Result[]>;

  /**
   * Returns the result of the specified station and team.
   *
   * @param stationId - The ID of the station.
   * @param teamId - The ID of the team.
   */
  getResultById(stationId: string, teamId: string): Promise<Result | null>;

  /**
   * Updates the result of the specified station and team.
   *
   * @param stationId - The ID of the station.
   * @param teamId - The ID of the team.
   * @param updates - The updates to apply to the result.
   */
  updateResult(
    stationId: string,
    teamId: string,
    updates: { points?: number; checkIn?: string; checkOut?: string | null },
  ): Promise<Result>;
}

export class ResultService implements IResultService {
  constructor(private prisma: PrismaClient) {}

  /**
   * @implements {IResultService}
   */
  async createResult(stationId: string, teamId: string): Promise<Result> {
    const result = await this.prisma.result.create({
      data: {
        stationId: stationId,
        teamId: teamId,
      },
    });

    return this.toResult(result);
  }

  /**
   * @implements {IResultService}
   */
  async deleteResult(stationId: string, teamId: string): Promise<void> {
    await this.prisma.result.delete({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
    });
  }

  /**
   * @implements {IResultService}
   */
  async deleteResultsByTeamId(teamId: string): Promise<void> {
    await this.prisma.result.deleteMany({
      where: {
        teamId: teamId,
      },
    });
  }

  /**
   * @implements {IResultService}
   */
  async getAll(): Promise<Result[]> {
    const results = await this.prisma.result.findMany({});

    return results.map((result) => this.toResult(result));
  }

  /**
   * @implements {IResultService}
   */
  async getResultById(
    stationId: string,
    teamId: string,
  ): Promise<Result | null> {
    const result = await this.prisma.result.findUnique({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
    });

    return result ? this.toResult(result) : null;
  }

  /**
   * @implements {IResultService}
   */
  async updateResult(
    stationId: string,
    teamId: string,
    updates: { points?: number; checkIn?: string; checkOut?: string | null },
  ): Promise<Result> {
    const result = await this.prisma.result.update({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
      data: {
        points: updates.points,
        checkIn:
          typeof updates.checkIn === 'string'
            ? new Date(updates.checkIn)
            : updates.checkIn,
        checkOut:
          typeof updates.checkOut === 'string'
            ? new Date(updates.checkOut)
            : updates.checkOut,
      },
    });

    return this.toResult(result);
  }

  /**
   * Converts a result read from the database to a result object.
   *
   * @param result - The result read from the database.
   * @returns The result object.
   */
  private toResult(result: PrismaResult): Result {
    return {
      ...result,
      checkIn: dayjs(result.checkIn),
      checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
    };
  }
}
