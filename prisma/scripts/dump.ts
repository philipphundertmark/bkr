import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const RESULT_SELECT = {
  stationId: true,
  teamId: true,
  checkIn: true,
  checkOut: true,
  points: true,
};

async function main() {
  const teams = await prisma.team.findMany({
    orderBy: { number: 'asc' },
  });

  writeAsJson(teams, 'dump/teams.json');

  const teamsWithResults = await prisma.team.findMany({
    orderBy: { number: 'asc' },
    include: {
      results: {
        select: RESULT_SELECT,
      },
    },
  });

  writeAsJson(teamsWithResults, 'dump/teams-with-results.json');

  const stations = await prisma.station.findMany({
    orderBy: { number: 'asc' },
  });

  writeAsJson(stations, 'dump/stations.json');

  const stationsWithResults = await prisma.station.findMany({
    orderBy: { number: 'asc' },
    include: {
      results: {
        select: RESULT_SELECT,
      },
    },
  });

  writeAsJson(stationsWithResults, 'dump/stations-with-results.json');

  const results = await prisma.result.findMany({
    orderBy: { checkIn: 'asc' },
  });

  writeAsJson(results, 'dump/results.json');
}

// Write the given `data` as JSON to the given `filename`
function writeAsJson(data: any, filename: string) {
  const cwd = process.cwd();
  const filePath = path.join(cwd, filename);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err: any) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`File ${filename} has been created`);
  });
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
