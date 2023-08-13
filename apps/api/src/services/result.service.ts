import { PrismaClient, Result as PrismaResult } from '@prisma/client';
import dayjs from 'dayjs';

import { Result } from '@bkr/api-interface';

export class ResultService {
  static readonly RESULT_SELECT = {
    stationId: true,
    teamId: true,
    checkIn: true,
    checkOut: true,
    points: true,
  };

  constructor(private prisma: PrismaClient) {}

  async createResult(stationId: string, teamId: string): Promise<Result> {
    const result = await this.prisma.result.create({
      data: {
        stationId: stationId,
        teamId: teamId,
      },
      select: ResultService.RESULT_SELECT,
    });

    return this.toResult(result);
  }

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

  async deleteResultsByTeamId(teamId: string): Promise<void> {
    await this.prisma.result.deleteMany({
      where: {
        teamId: teamId,
      },
    });
  }

  async getResultById(
    stationId: string,
    teamId: string
  ): Promise<Result | null> {
    const result = await this.prisma.result.findUnique({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
      select: ResultService.RESULT_SELECT,
    });

    return result ? this.toResult(result) : null;
  }

  async updateResult(
    stationId: string,
    teamId: string,
    updates: { points?: number; checkIn?: string; checkOut?: string | null }
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
      select: ResultService.RESULT_SELECT,
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
