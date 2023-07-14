import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Station, Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { StationService, TeamService } from '../../services';

@Component({
  selector: 'bkr-endresult',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './endresult.component.html',
  styleUrls: ['./endresult.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndresultComponent {
  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  stationsLoading = toSignal(this.stationService.loading$, {
    initialValue: false,
  });

  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });
  teamsLoading = toSignal(this.teamService.loading$, { initialValue: false });

  isRaceOver = toSignal(this.teamService.isRaceOver$);
  loading = computed(() => this.stationsLoading() || this.teamsLoading());
  publishLoading = signal(false);

  constructor(
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  handlePublish(): void {
    console.log('publish');
  }
}
