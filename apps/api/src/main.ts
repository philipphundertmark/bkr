import http from 'http';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { createApp } from './app';
import { config } from './config';
import { StationController } from './controllers/station.controller';
import { TeamController } from './controllers/team.controller';
import { TokenController } from './controllers/token.controller';
import { prisma } from './prisma';
import { StationService } from './services/station.service';
import { TeamService } from './services/team.service';
import { TokenService } from './services/token.service';

const stationService = new StationService(prisma);
const teamService = new TeamService(prisma);
const tokenService = new TokenService();

const app = createApp(
  [
    StationController(stationService),
    TeamController(teamService),
    TokenController(tokenService, stationService),
  ],
  {
    origin: config.ORIGIN,
  }
);
const server = http.createServer(app);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bierkistenrennen API',
      version: '1.0.0',
    },
  },
  apis: ['./controllers/*.controller.ts'],
};
const openapiSpecification = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port} 🚀`);
});
server.on('error', console.error);
