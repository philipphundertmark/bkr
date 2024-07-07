import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { StationUtils } from '@bkr/api-interface';

import { ButtonComponent, EmptyComponent } from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService } from '../../services';
import { Store } from '../../services/store';

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
  host: { class: 'page' },
  styleUrl: './station-list.component.scss',
  templateUrl: './station-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationListComponent {
  readonly StationUtils = StationUtils;

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  stations = this.store.stations;

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {}
}
