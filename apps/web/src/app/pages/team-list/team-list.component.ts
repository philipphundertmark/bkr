import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

import { TeamUtils } from '@bkr/api-interface';

import { ButtonComponent, EmptyComponent } from '../../components';
import {
  ArrowPathRoundedSquareIconComponent,
  ChevronRightIconComponent,
} from '../../icons/mini';
import { AuthService, NotificationService, TeamService } from '../../services';
import { ConfirmService } from '../../services/confirm.service';
import { Store } from '../../services/store';

@Component({
  selector: 'bkr-team-list',
  standalone: true,
  imports: [
    ArrowPathRoundedSquareIconComponent,
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    EmptyComponent,
    RouterModule,
  ],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamListComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  shuffleTeamsLoading = signal(false);
  teams = this.store.teams;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  shuffleTeams(): void {
    this.confirmService
      .info({
        title: 'Reihenfolge auslosen',
        message: 'Möchtest du die Reihenfolge der Teams wirklich neu auslosen?',
      })

      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.shuffleTeamsLoading.set(true);

          return this.teamService.shuffleTeams();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.shuffleTeamsLoading.set(false);
          this.notificationService.success('Reihenfolge wurde ausgelost.');
        },
        error: () => {
          this.shuffleTeamsLoading.set(false);
          this.notificationService.error(
            'Reihenfolge konnte nicht ausgelost werden.',
          );
        },
      });
  }
}
