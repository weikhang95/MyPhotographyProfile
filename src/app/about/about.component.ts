import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LocaleService } from '../i18n/locale.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly localeService = inject(LocaleService);
  private readonly cloudinaryBasePrefix = 'https://res.cloudinary.com/dbdetsjli/image/upload/';

  getCloudinaryUrl(filename: string, width: number, height: number): string {
    return `${this.cloudinaryBasePrefix}w_${width},h_${height},c_fit,q_auto,f_auto/${filename}`;
  }

  readonly profileImage = {
    filename: 'DSC07692_xzluao',
    alt: 'Chong Wei Khang (张炜康) portrait',
    width: 800,
    height: 800
  };
}
