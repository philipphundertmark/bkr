import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import {
  ButtonComponent,
  EmptyComponent,
  InputDirective,
  LoadingComponent,
} from '../../components';
import { AuthService, NotificationService, TeamService } from '../../services';

@Component({
  selector: 'bkr-team-edit',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    InputDirective,
    LoadingComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss'],
})
export class TeamEditComponent implements OnInit {
  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  loading = toSignal(this.teamService.loading$, { initialValue: false });
  saveLoading = signal(false);

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    penalty: new FormControl<number>(0, {
      nonNullable: true,
    }),
    members: new FormArray([this.buildMemberControl()]),
  });

  team$ = combineLatest([this.route.paramMap, this.teamService.teams$]).pipe(
    map(([params, teams]) =>
      teams.find((team) => team.id === params.get('teamId'))
    )
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.team$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((team) => {
      this.form.patchValue({
        name: team?.name,
        number: team?.number,
        penalty: team?.penalty,
      });
    });
  }

  handleSave(teamId: string): void {
    const { name, number, members, penalty } = this.form.value;

    if (
      this.form.invalid ||
      typeof name === 'undefined' ||
      typeof number === 'undefined' ||
      number === null
    ) {
      return;
    }

    const nonEmptyMembers =
      members?.filter((member) => member.length > 0) ?? [];

    this.saveLoading.set(true);

    this.teamService
      .updateTeam(teamId, {
        name,
        number,
        members: nonEmptyMembers,
        penalty,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saveLoading.set(false);
          this.notificationService.success('Team wurde aktualisiert.');

          this.router.navigate(['/teams', teamId]);
        },
        error: (err: HttpErrorResponse) => {
          this.saveLoading.set(false);

          const error = err.error?.error;

          if (error === '"number" must be unique') {
            this.notificationService.error(
              'Es gibt bereits ein Team mit dieser Nummer.'
            );
          } else {
            this.notificationService.error(
              'Team konnte nicht aktualisiert werden.'
            );
          }
        },
      });
  }

  private buildMemberControl(): FormControl<string> {
    return new FormControl<string>('', {
      nonNullable: true,
    });
  }
}
