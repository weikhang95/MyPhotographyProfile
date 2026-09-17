import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  copyCode(codeSnippet: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codeSnippet);
    }
  }
}
