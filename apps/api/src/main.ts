import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

import { config } from './config';
import { StationController } from './controllers/station.controller';
import { TeamController } from './controllers/team.controller';
import { TokenController } from './controllers/token.controller';
import { prisma } from './prisma';
import { StationService } from './services/station.service';
import { TeamService } from './services/team.service';
import { TokenService } from './services/token.service';

const app = express();
const server = http.createServer(app);

// Services
const stationService = new StationService(prisma);
const teamService = new TeamService(prisma);
const tokenService = new TokenService();

// Middleware
app.use(
  cors({
    origin: config.ORIGIN,
  })
);
app.use(express.json());
app.use(helmet());

// Routes
app.use(StationController(stationService));
app.use(TeamController(teamService));
app.use(TokenController(tokenService, stationService));

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
