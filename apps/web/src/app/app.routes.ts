import { Route } from '@angular/router';

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
  },
  {
    path: 'stations/:stationId',
    component: StationDetailsComponent,
  },
  {
    path: 'stations/:stationId/edit',
    component: StationEditComponent,
  },
  {
    path: 'teams',
    component: TeamListComponent,
  },
  {
    path: 'teams/new',
    component: TeamNewComponent,
  },
  {
    path: 'teams/:teamId',
    component: TeamDetailsComponent,
  },
  {
    path: 'teams/:teamId/edit',
    component: TeamEditComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
