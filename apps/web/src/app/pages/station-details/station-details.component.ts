import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { ButtonComponent } from '../../components';
import { AuthService, StationService } from '../../services';

@Component({
  selector: 'bkr-station-details',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
})
export class StationDetailsComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.stationService.loading$);

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
}
