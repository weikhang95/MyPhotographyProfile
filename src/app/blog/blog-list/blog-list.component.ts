import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { SeriesChartComponent } from '../components/series-chart/series-chart.component';

export type FilterCategory = 'all' | 'basics' | 'architecture' | 'case-studies';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, SeriesChartComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
  readonly localeService = inject(LocaleService);

  readonly posts = computed(() => this.localeService.dict().blogList.posts);
  readonly selectedFilter = signal<FilterCategory>('all');
  readonly expandedPostIds = signal<Set<string>>(new Set(['01']));

  readonly filterCounts = computed(() => {
    const list = this.posts();
    return {
      all: list.length,
      basics: list.filter((p) => p.category === 'basics').length,
      architecture: list.filter((p) => p.category === 'architecture').length,
      'case-studies': list.filter((p) => p.category === 'case-studies').length,
    };
  });

  readonly displayPosts = computed(() => {
    const filter = this.selectedFilter();
    const list = this.posts();
    if (filter === 'all') {
      return list;
    }
    return list.filter((p) => p.category === filter);
  });

  setFilter(filter: FilterCategory): void {
    this.selectedFilter.set(filter);
  }

  toggleExpand(id: string): void {
    const current = new Set(this.expandedPostIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.expandedPostIds.set(current);
  }

  isExpanded(id: string): boolean {
    return this.expandedPostIds().has(id);
  }
}
