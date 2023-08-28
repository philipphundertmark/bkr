import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { MapIconComponent } from '../../icons/mini';

@Component({
  selector: 'bkr-rules',
  standalone: true,
  imports: [ButtonComponent, CommonModule, MapIconComponent, RouterModule],
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  @HostBinding('class.page') page = true;
}
