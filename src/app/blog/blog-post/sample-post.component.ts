import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { EditorialGraphicComponent } from '../components/editorial-graphic/editorial-graphic.component';

@Component({
  selector: 'app-sample-post',
  standalone: true,
  imports: [RouterLink, EditorialGraphicComponent],
  templateUrl: './sample-post.component.html',
  styleUrls: ['./sample-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamplePostComponent {
  readonly localeService = inject(LocaleService);

  readonly seriesPosts = computed(() => this.localeService.dict().blogList.posts);
  readonly copiedForLlm = signal(false);

  copyCode(codeSnippet: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codeSnippet);
    }
  }

  copyForLlm(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const dict = this.localeService.dict().post;
      const content = `# ${dict.title}\nBy ${dict.author}\nDate: ${dict.publishDate}\nSeries: ${dict.seriesTag}\n\n${dict.lead}\n\n---\n\n${dict.pIntro}\n\n## 1. ${dict.h2Mode1}\n${dict.pMode1Intro}\n\n## 2. ${dict.h2Mode2}\n${dict.pMode2Intro}\n\n## 3. ${dict.h2Mode3}\n${dict.pMode3Intro}\n\n${dict.pClosing}`;
      navigator.clipboard.writeText(content);
      this.copiedForLlm.set(true);
      setTimeout(() => this.copiedForLlm.set(false), 2000);
    }
  }
}
