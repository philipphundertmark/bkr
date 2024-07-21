import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { EMPTY, switchMap } from 'rxjs';

import { Ranking, TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  DangerZoneComponent,
  EmptyComponent,
} from '../../components';
import {
  PauseIconComponent,
  PlayIconComponent,
  TrashIconComponent,
} from '../../icons/mini';
import { DatePipe } from '../../pipes';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';
import { ConfirmService } from '../../services/confirm.service';
import { Store } from '../../services/store';

@Component({
  selector: 'bkr-team-details',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    DangerZoneComponent,
    DatePipe,
    EmptyComponent,
    PauseIconComponent,
    PlayIconComponent,
    RouterModule,
    TrashIconComponent,
  ],
  host: { class: 'page' },
  styleUrl: './team-details.component.scss',
  templateUrl: './team-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailsComponent implements OnInit {
  readonly Ranking = Ranking;
  readonly TeamUtils = TeamUtils;

  /** Route parameter */
  teamId = input.required<string>();

  teams = this.store.teams;

  team = computed(
    () => this.teams().find(({ id }) => id === this.teamId()) ?? null,
  );
  team$ = toObservable(this.team);

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });

  deleteTeamLoading = signal(false);
  deleteTeamResultsLoading = signal(false);
  startTeamLoading = signal(false);
  stopTeamLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.team$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((team) => {
      if (!team) {
        this.router.navigate(['/']);
        return;
      }
    });
  }

  handleDeleteTeam(teamId: string): void {
    this.confirmService
      .delete({
        title: 'Team löschen',
        message: 'Möchtest du das Team wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteTeamLoading.set(true);

          return this.teamService.deleteTeam(teamId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.deleteTeamLoading.set(false);
          this.store.deleteTeam(teamId);
          this.notificationService.success('Team gelöscht.');

          this.router.navigate(['/teams']);
        },
        error: () => {
          this.deleteTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gelöscht werden.');
        },
      });
  }

  handleDeleteTeamResults(teamId: string): void {
    this.confirmService
      .delete({
        title: 'Ergebnisse löschen',
        message: 'Möchtest du die Ergebnisse des Teams wirklich löschen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.deleteTeamResultsLoading.set(true);

          return this.resultService.deleteResultsByTeamId(teamId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.deleteTeamResultsLoading.set(false);
          this.store.deleteResultsByTeamId(teamId);
          this.notificationService.success('Ergebnisse gelöscht.');
        },
        error: () => {
          this.deleteTeamResultsLoading.set(false);
          this.notificationService.error(
            'Ergebnisse konnten nicht gelöscht werden.',
          );
        },
      });
  }

  handleStartTeam(teamId: string): void {
    this.confirmService
      .info({
        title: 'Team starten',
        message: 'Möchtest du das Team wirklich starten?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.startTeamLoading.set(true);

          return this.teamService.updateTeam(teamId, {
            startedAt: dayjs().toISOString(),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (team) => {
          this.startTeamLoading.set(false);
          this.store.setTeam(team);
          this.notificationService.success('Team gestartet.');
        },
        error: () => {
          this.startTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gestartet werden.');
        },
      });
  }

  handleStopTeam(teamId: string): void {
    this.confirmService
      .info({
        title: 'Team stoppen',
        message: 'Möchtest du das Team wirklich stoppen?',
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.stopTeamLoading.set(true);

          return this.teamService.updateTeam(teamId, {
            finishedAt: dayjs().toISOString(),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (team) => {
          this.stopTeamLoading.set(false);
          this.store.setTeam(team);
          this.notificationService.success('Team gestoppt.');
        },
        error: () => {
          this.stopTeamLoading.set(false);
          this.notificationService.error('Team konnte nicht gestoppt werden.');
        },
      });
  }
}
