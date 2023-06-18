import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'bkr-loading',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {}
