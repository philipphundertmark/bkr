import { PrismaClient, Result } from '@prisma/client';

export class ResultService {
  static readonly RESULT_SELECT = {
    stationId: true,
    teamId: true,
    checkIn: true,
    checkOut: true,
    points: true,
  };

  constructor(private prisma: PrismaClient) {}

  createResult(stationId: string, teamId: string): Promise<Result> {
    return this.prisma.result.create({
      data: {
        stationId: stationId,
        teamId: teamId,
      },
      select: ResultService.RESULT_SELECT,
    });
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

  getResultById(stationId: string, teamId: string): Promise<Result | null> {
    return this.prisma.result.findUnique({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
      select: ResultService.RESULT_SELECT,
    });
  }

  updateResult(
    stationId: string,
    teamId: string,
    updates: { points?: number; checkIn?: string; checkOut?: string }
  ): Promise<Result> {
    return this.prisma.result.update({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
      data: {
        points: updates.points,
        checkIn: updates.checkIn ? new Date(updates.checkIn) : undefined,
        checkOut: updates.checkOut ? new Date(updates.checkOut) : undefined,
      },
      select: ResultService.RESULT_SELECT,
    });
  }
}
