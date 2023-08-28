import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';

@Component({
  selector: 'bkr-rules',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  @HostBinding('class.page') page = true;
}
