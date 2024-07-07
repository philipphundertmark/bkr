import http from 'http';

import { createApp } from './app';
import { config } from './config';
import { ResultController } from './controllers/result.controller';
import { SettingsController } from './controllers/settings.controller';
import { StationController } from './controllers/station.controller';
import { TeamController } from './controllers/team.controller';
import { TokenController } from './controllers/token.controller';
import { prisma } from './prisma';
import { ResultService } from './services/result.service';
import { SettingsService } from './services/settings.service';
import { StationService } from './services/station.service';
import { TeamService } from './services/team.service';
import { TokenService } from './services/token.service';

const resultService = new ResultService(prisma);
const settingsService = new SettingsService(prisma);
const stationService = new StationService(prisma);
const teamService = new TeamService(prisma);
const tokenService = new TokenService();

const app = createApp(
  [
    ResultController(
      resultService,
      settingsService,
      stationService,
      teamService,
    ),
    SettingsController(settingsService),
    StationController(stationService),
    TeamController(resultService, teamService),
    TokenController(tokenService, stationService),
  ],
  {
    origin: config.ORIGIN,
  },
);
const server = http.createServer(app);

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port} 🚀`);
});
server.on('error', console.error);
