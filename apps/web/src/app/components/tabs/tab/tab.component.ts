import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'bkr-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input({ required: true }) bkrKey!: string;

  @Output() bkrClick = new EventEmitter<TabComponent>();

  @HostBinding('class.active')
  active = false;

  @HostListener('click')
  onClick(): void {
    this.bkrClick.emit(this);
  }
}
