import { Route } from '@angular/router';

import { Role } from '@bkr/api-interface';

import { roleCanActivateFn } from './guards/role.guard';
import {
  AuthComponent,
  HomeComponent,
  RulesComponent,
  StationDetailsComponent,
  StationEditComponent,
  StationListComponent,
  StationNewComponent,
  TeamDetailsComponent,
  TeamEditComponent,
  TeamListComponent,
  TeamNewComponent,
} from './pages';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'rules',
    component: RulesComponent,
  },
  {
    path: 'stations',
    component: StationListComponent,
  },
  {
    path: 'stations/new',
    component: StationNewComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'stations/:stationId',
    component: StationDetailsComponent,
  },
  {
    path: 'stations/:stationId/edit',
    component: StationEditComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'teams',
    component: TeamListComponent,
  },
  {
    path: 'teams/new',
    component: TeamNewComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'teams/:teamId',
    component: TeamDetailsComponent,
  },
  {
    path: 'teams/:teamId/edit',
    component: TeamEditComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
