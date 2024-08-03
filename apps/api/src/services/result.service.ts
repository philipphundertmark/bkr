import { PrismaClient, Result as PrismaResult } from '@prisma/client';
import dayjs from 'dayjs';

import { Result } from '@bkr/api-interface';

export interface IResultService {
  createResult(stationId: string, teamId: string): Promise<Result>;

  deleteResult(stationId: string, teamId: string): Promise<void>;

  deleteResultsByTeamId(teamId: string): Promise<void>;

  getAll(): Promise<Result[]>;

  getResultById(stationId: string, teamId: string): Promise<Result | null>;

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

  private toResult(result: PrismaResult): Result {
    return {
      ...result,
      checkIn: dayjs(result.checkIn),
      checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
    };
  }
}
