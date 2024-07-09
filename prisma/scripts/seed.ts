import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed teams
  const teams = await prisma.team.createMany({
    data: [
      {
        number: 1,
        name: 'Team 1',
        help: false,
        members: ['Alice', 'Bob'],
      },
      {
        number: 2,
        name: 'Team 2',
        help: false,
        members: ['Charlie', 'David'],
      },
      {
        number: 3,
        name: 'Team 3',
        help: false,
        members: ['Eve', 'Frank'],
      },
      {
        number: 4,
        name: 'Team 4',
        help: false,
        members: ['Grace', 'Hank'],
      },
    ],
  });

  console.table(`Created ${teams.count} teams`);

  // Seed stations
  const stations = await prisma.station.createMany({
    data: [
      {
        number: 1,
        name: 'Station 1',
        code: '123456',
        order: 'DESC',
        members: ['Ivan', 'Judy', 'Kevin'],
      },
      {
        number: 2,
        name: 'Station 2',
        code: '234567',
        order: 'ASC',
        members: ['Liam', 'Mia', 'Nina'],
      },
      {
        number: 3,
        name: 'Station 3',
        code: '345678',
        order: 'DESC',
        members: ['Oliver', 'Pam', 'Quinn'],
      },
      {
        number: 4,
        name: 'Station 4',
        code: '456789',
        order: 'ASC',
        members: ['Ryan', 'Sara', 'Tom'],
      },
    ],
  });

  console.table(`Created ${teams.count} stations`);
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
