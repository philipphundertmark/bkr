import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonComponent, InputDirective } from '../../components';
import { NotificationService, TeamService } from '../../services';

@Component({
  selector: 'bkr-team-new',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputDirective, RouterModule],
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss'],
})
export class TeamNewComponent {
  form = new FormGroup({});
  loading = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  handleSave(): void {
    this.loading = true;

    this.teamService
      .createTeam({
        name: 'Team A',
        number: 1,
        members: ['Alice', 'Bob'],
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.notificationService.success('Team wurde erstellt.');

          this.router.navigate(['/teams']);
        },
        error: () => {
          this.loading = false;
          this.notificationService.error('Team konnte nicht erstellt werden.');
        },
      });
  }
}
