import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Station } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService, StationService } from '../../services';

@Component({
  selector: 'bkr-station-list',
  standalone: true,
  imports: [
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.stationService.loading$, { initialValue: false });
  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly stationService: StationService
  ) {}

  formatStationMembers(station: Station): string {
    if (!station.members.length) {
      return 'Keine Mitglieder';
    }

    return station.members.join(', ');
  }
}
