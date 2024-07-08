import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'bkr-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabComponents?: QueryList<TabComponent>;

  @Input() bkrActiveTab = '';

  @Output() bkrChange = new EventEmitter<string>();

  @HostBinding('attr.aria-label') ariaLabel = 'Tabs';

  private readonly destroyRef = inject(DestroyRef);

  /**
   * @implements {AfterContentInit}
   */
  ngAfterContentInit(): void {
    const activeTab = this.tabComponents?.find((tab) => tab.active);

    if (!activeTab && this.tabComponents?.length) {
      const tabToActivate =
        this.tabComponents.find((tab) => tab.bkrKey === this.bkrActiveTab) ??
        this.tabComponents.first;
      this.selectTab(tabToActivate);
    }

    merge(...(this.tabComponents?.map((tab) => tab.bkrClick) ?? []))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tab) => {
        this.selectTab(tab);
        this.bkrChange.emit(tab.bkrKey);
      });
  }

  private selectTab(tab: TabComponent): void {
    this.tabComponents?.forEach((t) => (t.active = false));
    tab.active = true;
  }
}
