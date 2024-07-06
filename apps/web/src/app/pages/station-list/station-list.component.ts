import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Station, StationUtils } from '@bkr/api-interface';

import { ButtonComponent, EmptyComponent } from '../../components';
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
    RouterModule,
  ],
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationListComponent {
  @HostBinding('class.page') page = true;

  readonly StationUtils = StationUtils;

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly stationService: StationService,
  ) {}
}
