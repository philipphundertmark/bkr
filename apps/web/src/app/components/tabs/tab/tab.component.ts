import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bkr-tab',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './tab.component.scss',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  key = input.required<string>();

  activate = output<TabComponent>();
  activate$ = outputToObservable(this.activate);

  @HostBinding('class.active')
  active = false;

  @HostListener('click')
  onClick(): void {
    this.activate.emit(this);
  }
}
