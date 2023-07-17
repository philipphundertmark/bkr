import { Route } from '@angular/router';

import { Role } from '@bkr/api-interface';

import { roleCanActivateFn } from './guards/role.guard';
import {
  AuthComponent,
  CheckInComponent,
  CheckOutComponent,
  EndresultComponent,
  HomeComponent,
  MyStationComponent,
  ResultComponent,
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
    path: 'endresult',
    component: EndresultComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.ADMIN],
    },
  },
  {
    path: 'my-station',
    component: MyStationComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.STATION],
    },
  },
  {
    path: 'my-station/check-in',
    component: CheckInComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.STATION],
    },
  },
  {
    path: 'my-station/check-out',
    component: CheckOutComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.STATION],
    },
  },
  {
    path: 'my-station/result',
    component: ResultComponent,
    canActivate: [roleCanActivateFn],
    data: {
      roles: [Role.STATION],
    },
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
