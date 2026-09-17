import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { LocaleService } from '../../../i18n/locale.service';

type SeriesPost = ReturnType<LocaleService['dict']>['blogList']['posts'][number];

interface RungLine {
  readonly x1: number;
  readonly x2: number;
  readonly y: number;
  readonly opacity: number;
  readonly delay: number;
}

interface RungColumn {
  readonly id: string;
  readonly x: number;
  readonly episode: string;
  readonly track: string;
  readonly minutes: number;
  readonly live: boolean;
  readonly topY: number;
  readonly rungs: readonly RungLine[];
  readonly dots: readonly RungLine[];
  readonly delay: number;
  readonly tooltip: string;
}

/** Deterministic pseudo-random jitter from the lieflat-charts Mono tokens: same shape on every render. */
const rnd = (i: number, k: number): number => Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

const BASE_Y = 196;
const STEP = 7;
const HALF_WIDTH = 26;
const RUNGS_PER_MINUTE = 2;

/**
 * Series reading-time chart, ported from lieflat-charts F1 Rung Bars
 * (basics-gallery.html · "B1 · rung bars"): one rung = 30 seconds of reading,
 * published episodes inked in clay, upcoming ones drawn as dashed estimates.
 */
@Component({
  selector: 'app-series-chart',
  standalone: true,
  templateUrl: './series-chart.component.html',
  styleUrls: ['./series-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesChartComponent {
  readonly localeService = inject(LocaleService);
  readonly posts = input.required<readonly SeriesPost[]>();

  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('chart');

  readonly columns = computed<RungColumn[]>(() => {
    const dict = this.localeService.dict().blogList;
    const trackLabel: Record<SeriesPost['category'], string> = {
      basics: dict.filterBasics,
      architecture: dict.filterArchitecture,
      'case-studies': dict.filterCaseStudies,
    };

    return this.posts().map((post, i) => {
      const minutes = parseMinutes(post.readTime);
      const live = post.status === 'published';
      const x = 80 + i * 120;
      const count = minutes * RUNGS_PER_MINUTE;
      const rungs: RungLine[] = [];
      const dots: RungLine[] = [];

      for (let k = 0; k < count; k++) {
        const y = BASE_Y - k * STEP;
        const w = HALF_WIDTH - 3 + rnd(k + 1, i + 2) * 6;
        const delay = i * 0.1 + k * 0.03;
        rungs.push({ x1: x - w, x2: x + w, y, opacity: 0.5 + rnd(k + 2, i + 4) * 0.5, delay });
        // A dot beside every fifth minute keeps long columns countable.
        if (k % (5 * RUNGS_PER_MINUTE) === 5 * RUNGS_PER_MINUTE - 1) {
          dots.push({ x1: x + HALF_WIDTH + 7, x2: x + HALF_WIDTH + 7, y, opacity: 1, delay });
        }
      }

      const status = live ? dict.statusPublished : dict.statusUpcoming;
      return {
        id: post.id,
        x,
        episode: `EP.${post.episode}`,
        track: trackLabel[post.category],
        minutes,
        live,
        topY: BASE_Y - (count - 1) * STEP,
        rungs,
        dots,
        delay: i * 0.1,
        tooltip: `EP.${post.episode} · ${post.title} · ${post.readTime} · ${status}`,
      };
    });
  });

  readonly totalMinutes = computed(() => this.columns().reduce((sum, c) => sum + c.minutes, 0));
  readonly liveMinutes = computed(() =>
    this.columns().filter(c => c.live).reduce((sum, c) => sum + c.minutes, 0),
  );

  readonly headline = computed(() =>
    fill(this.localeService.dict().blogList.chartTitle, {
      total: this.totalMinutes(),
      live: this.liveMinutes(),
    }),
  );

  readonly ariaLabel = computed(() =>
    `${this.headline()}. ${this.columns().map(c => `${c.episode} ${c.minutes} min`).join(', ')}`,
  );

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const svg = this.svgRef().nativeElement;
      if (typeof IntersectionObserver === 'undefined') {
        svg.classList.add('is-revealed');
        return;
      }
      const io = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) {
            svg.classList.add('is-revealed');
            io.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      io.observe(svg);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  /** Click-to-replay, matching the gallery's obsReveal behaviour. */
  replay(): void {
    const svg = this.svgRef().nativeElement;
    svg.classList.remove('is-revealed');
    void svg.getBoundingClientRect();
    svg.classList.add('is-revealed');
  }
}

function parseMinutes(readTime: string): number {
  const match = readTime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function fill(template: string, values: Record<string, number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
