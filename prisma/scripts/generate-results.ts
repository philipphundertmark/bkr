import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const now = new Date();

// The first team started 2 hours ago
const start = new Date(now.getTime() - 2 * HOUR);

// Teams start every 4 minutes
const interval = 4 * MINUTE;

async function main() {
  // 1) Delete all existing results
  const { count } = await prisma.result.deleteMany();

  console.log(`Deleted ${count} results`);

  // 2) Get all stations and teams
  const stations = await prisma.station.findMany({
    orderBy: { number: 'asc' },
  });
  const teams = await prisma.team.findMany({
    orderBy: { number: 'asc' },
  });

  // 3) For each team, generate start and finish times and results for each station
  for (let i = 0; i < teams.length; i++) {
    let team = teams[i];

    console.log(`---------------- Team ${team.number} ----------------`);

    // Teams run between 1 and 2 hours
    const duration = 1 * HOUR + Math.floor(Math.random() * 1 * HOUR);

    const startedAt = new Date(start.getTime() + i * interval);
    const finishedAt = new Date(startedAt.getTime() + duration);

    // There's a 25% chance that teams receive a penalty
    // Penalties are between 2 and 15 minutes and are stored in minutes
    const penalty =
      Math.random() < 0.25 ? 2 + Math.floor(Math.random() * 13) : 0;

    console.log({
      startedAt,
    });

    team = await prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        startedAt,
        finishedAt,
        penalty,
      },
    });

    // The time it takes to get from one station to the next
    const segment = Math.floor(duration / (stations.length + 1));

    for (let j = 0; j < stations.length; j++) {
      const station = stations[j];

      // Teams stay between 1 and 10 minutes at each station
      const duration = 1 * MINUTE + Math.floor(Math.random() * 10 * MINUTE);

      // Teams score between 0 and 20 points
      const points = Math.floor(Math.random() * 20);

      const checkIn = new Date(startedAt.getTime() + (j + 1) * segment);
      const checkOut = new Date(checkIn.getTime() + duration);

      const result = await prisma.result.create({
        data: {
          station: {
            connect: {
              id: station.id,
            },
          },
          team: {
            connect: {
              id: team.id,
            },
          },
          checkIn,
          checkOut,
          points,
        },
      });

      console.log({
        station: station.number,
        checkIn: result.checkIn,
        checkOut: result.checkOut,
        points: result.points,
      });
    }

    console.log({
      duration,
      finishedAt,
      penalty,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
