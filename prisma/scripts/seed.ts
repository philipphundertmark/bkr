import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed teams
  const teams = await prisma.team.createMany({
    data: [
      {
        number: 1,
        name: 'Team 1',
        ranking: 'A',
        members: ['Alice', 'Bob'],
      },
      {
        number: 2,
        name: 'Team 2',
        ranking: 'A',
        members: ['Charlie', 'David'],
      },
      {
        number: 3,
        name: 'Team 3',
        ranking: 'A',
        members: ['Eve', 'Frank'],
      },
      {
        number: 4,
        name: 'Team 4',
        ranking: 'A',
        members: ['Grace', 'Hank'],
      },
      {
        number: 5,
        name: 'Team 5',
        ranking: 'B',
        members: ['Ivy', 'Jack'],
      },
      {
        number: 6,
        name: 'Team 6',
        ranking: 'B',
        members: ['Kate', 'Luke'],
      },
      {
        number: 7,
        name: 'Team 7',
        ranking: 'B',
        members: ['Mary', 'Nick'],
      },
      {
        number: 8,
        name: 'Team 8',
        ranking: 'B',
        members: ['Owen', 'Patty'],
      },
      {
        number: 9,
        name: 'Team 9',
        ranking: 'A',
        members: ['Quincy', 'Rose'],
      },
      { number: 10, name: 'Team 10', ranking: 'B', members: ['Sam', 'Tina'] },
      { number: 11, name: 'Team 11', ranking: 'A', members: ['Uma', 'Vince'] },
      {
        number: 12,
        name: 'Team 12',
        ranking: 'B',
        members: ['Wendy', 'Xavier'],
      },
      { number: 13, name: 'Team 13', ranking: 'A', members: ['Yara', 'Zack'] },
      { number: 14, name: 'Team 14', ranking: 'B', members: ['Amy', 'Ben'] },
      { number: 15, name: 'Team 15', ranking: 'A', members: ['Cara', 'Drew'] },
      { number: 16, name: 'Team 16', ranking: 'B', members: ['Ella', 'Finn'] },
      { number: 17, name: 'Team 17', ranking: 'A', members: ['Gina', 'Hugo'] },
      { number: 18, name: 'Team 18', ranking: 'B', members: ['Iris', 'Jake'] },
      { number: 19, name: 'Team 19', ranking: 'A', members: ['Kara', 'Liam'] },
      { number: 20, name: 'Team 20', ranking: 'B', members: ['Mona', 'Noah'] },
      { number: 21, name: 'Team 21', ranking: 'A', members: ['Omar', 'Pam'] },
      { number: 22, name: 'Team 22', ranking: 'B', members: ['Quinn', 'Ryan'] },
      { number: 23, name: 'Team 23', ranking: 'A', members: ['Sara', 'Tom'] },
      { number: 24, name: 'Team 24', ranking: 'B', members: ['Uma', 'Vince'] },
      {
        number: 25,
        name: 'Team 25',
        ranking: 'A',
        members: ['Wendy', 'Xavier'],
      },
      { number: 26, name: 'Team 26', ranking: 'B', members: ['Yara', 'Zack'] },
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

  console.table(`Created ${stations.count} stations`);
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
