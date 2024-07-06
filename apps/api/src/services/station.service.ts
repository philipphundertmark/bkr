import { Order, PrismaClient, Station as PrismaStation } from '@prisma/client';
import dayjs from 'dayjs';

import { Station } from '@bkr/api-interface';

import { ResultService } from './result.service';

export class StationService {
  constructor(private prisma: PrismaClient) {}

  async createStation(
    name: string,
    number: number,
    members: string[],
    code: string,
    order: Order,
  ): Promise<Station> {
    const station = await this.prisma.station.create({
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

    return this.toStation(station);
  }

  async deleteStation(id: string): Promise<void> {
    await this.prisma.station.delete({
      where: {
        id: id,
      },
    });
  }

  async getAll(): Promise<Station[]> {
    const stations = await this.prisma.station.findMany({
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return stations.map((station) => this.toStation(station));
  }

  async getStationById(id: string): Promise<Station | null> {
    const station = await this.prisma.station.findUnique({
      where: {
        id: id,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return station ? this.toStation(station) : null;
  }

  async getStationByNumber(number: number): Promise<Station | null> {
    const station = await this.prisma.station.findUnique({
      where: {
        number: number,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return station ? this.toStation(station) : null;
  }

  async getStationByCode(code: string): Promise<Station | null> {
    const station = await this.prisma.station.findUnique({
      where: {
        code: code,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });

    return station ? this.toStation(station) : null;
  }

  async updateStation(
    id: string,
    updates: {
      name?: string;
      number?: number;
      members?: string[];
      code?: string;
      order?: Order;
    },
  ): Promise<Station> {
    const station = await this.prisma.station.update({
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

    return this.toStation(station);
  }

  private toStation(
    station: PrismaStation & {
      results: {
        stationId: string;
        teamId: string;
        checkIn: Date;
        checkOut: Date | null;
        points: number;
      }[];
    },
  ): Station {
    return {
      ...station,
      createdAt: dayjs(station.createdAt),
      updatedAt: dayjs(station.updatedAt),
      results: station.results.map((result) => ({
        ...result,
        checkIn: dayjs(result.checkIn),
        checkOut: result.checkOut ? dayjs(result.checkOut) : undefined,
      })),
    };
  }
}
