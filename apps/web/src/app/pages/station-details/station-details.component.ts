import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { Station } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import {
  ArrowDownCircleIconComponent,
  ArrowUpCircleIconComponent,
} from '../../icons/mini';
import { AuthService, StationService } from '../../services';

@Component({
  selector: 'bkr-station-details',
  standalone: true,
  imports: [
    ArrowDownCircleIconComponent,
    ArrowUpCircleIconComponent,
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
})
export class StationDetailsComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.stationService.loading$, { initialValue: false });

  station$ = combineLatest([
    this.route.paramMap,
    this.stationService.stations$,
  ]).pipe(
    map(([params, stations]) =>
      stations.find((station) => station.id === params.get('stationId'))
    )
  );

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService
  ) {}

  formatStationMembers(station: Station): string {
    if (!station.members.length) {
      return 'Keine Mitglieder';
    }

    return station.members.join(', ');
  }
}
