import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';

@Component({
  selector: 'bkr-rules',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent {}
