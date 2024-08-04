import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { MapIconComponent } from '../../icons/mini';

@Component({
  selector: 'bkr-rules',
  standalone: true,
  imports: [ButtonComponent, CommonModule, MapIconComponent, RouterModule],
  host: { class: 'page' },
  styleUrl: './rules.component.scss',
  templateUrl: './rules.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {}
