import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { setupApp } from './app';
import { config } from './config';
import { ResultController } from './controllers/result.controller';
import { SettingsController } from './controllers/settings.controller';
import { StationController } from './controllers/station.controller';
import { TeamController } from './controllers/team.controller';
import { TokenController } from './controllers/token.controller';
import { prisma } from './prisma';
import { LiveService } from './services/live.service';
import { ResultService } from './services/result.service';
import { SettingsService } from './services/settings.service';
import { StationService } from './services/station.service';
import { TeamService } from './services/team.service';
import { TokenService } from './services/token.service';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.ORIGIN,
  },
});

const liveService = new LiveService(io);
const resultService = new ResultService(prisma);
const settingsService = new SettingsService(prisma);
const stationService = new StationService(prisma);
const teamService = new TeamService(prisma);
const tokenService = new TokenService();

setupApp(
  app,
  [
    ResultController(
      liveService,
      resultService,
      settingsService,
      stationService,
      teamService,
    ),
    SettingsController(settingsService),
    StationController(liveService, stationService),
    TeamController(liveService, resultService, teamService),
    TokenController(tokenService, stationService),
  ],
  {
    origin: config.ORIGIN,
  },
);

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port} 🚀`);
});
server.on('error', console.error);
