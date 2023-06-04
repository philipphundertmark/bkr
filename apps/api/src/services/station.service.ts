import { Order, PrismaClient, Station } from '@prisma/client';

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
    return this.prisma.station.findMany();
  }

  getStationById(id: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        id: id,
      },
    });
  }

  getStationByNumber(number: number): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        number: number,
      },
    });
  }

  getStationByCode(code: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        code: code,
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
    });
  }
}
