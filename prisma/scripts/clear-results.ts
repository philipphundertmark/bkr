import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Delete all existing results
  const { count } = await prisma.result.deleteMany();

  console.log(`Deleted ${count} results`);

  // 2) Get all teams
  const teams = await prisma.team.findMany({
    orderBy: { number: 'asc' },
  });

  // 3) Reset startedAt, finishedAt, and penalty for all teams
  for (const team of teams) {
    await prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        startedAt: null,
        finishedAt: null,
        penalty: 0,
      },
    });
  }

  console.log(`Reset ${teams.length} teams`);
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
