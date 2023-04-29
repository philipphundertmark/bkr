import type { EventType as PrismaEventType } from '@prisma/client';

export type EventType = PrismaEventType;

export const EventType: { [K in PrismaEventType]: K } = {
  RUN_IN: 'RUN_IN',
  RUN_OUT: 'RUN_OUT',
  STATION_IN: 'STATION_IN',
  STATION_OUT: 'STATION_OUT',
};
