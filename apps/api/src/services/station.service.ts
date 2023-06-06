import { Order, PrismaClient, Station } from '@prisma/client';

import { ResultService } from './result.service';

export class StationService {
  constructor(private prisma: PrismaClient) {}

  createStation(
    name: string,
    number: number,
    members: string[],
    code: string,
    order: Order
  ): Promise<Station> {
    return this.prisma.station.create({
      data: {
        name: name,
        number: number,
        code: code,
        members: members,
        order: order,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  async deleteStation(id: string): Promise<void> {
    await this.prisma.station.delete({
      where: {
        id: id,
      },
    });
  }

  getAll(): Promise<Station[]> {
    return this.prisma.station.findMany({
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  getStationById(id: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        id: id,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  getStationByNumber(number: number): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        number: number,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  getStationByCode(code: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        code: code,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  updateStation(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      code?: string;
      order?: Order;
    }
  ): Promise<Station> {
    return this.prisma.station.update({
      where: {
        id: id,
      },
      data: {
        name: updates.name,
        number: updates.number,
        members: updates.members,
        code: updates.code,
        order: updates.order,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }
}
