import { 
  Component, 
  OnInit, 
  AfterViewInit, 
  ElementRef, 
  OnDestroy, 
  ChangeDetectionStrategy, 
  inject, 
  signal, 
  computed 
} from '@angular/core';
import { Fancybox } from '@fancyapps/ui';
import { LocaleService } from '../i18n/locale.service';

export type PortfolioCategory = 'all' | 'street' | 'travel' | 'still_life';

export interface PortfolioImage {
  readonly id: string;
  readonly filename: string;
  readonly titleEn: string;
  readonly titleZh: string;
  readonly locationEn: string;
  readonly locationZh: string;
  readonly year: string;
  readonly category: 'street' | 'travel' | 'still_life';
  readonly gear: string;
  readonly alt: string;
  readonly orientation: 'landscape' | 'portrait';
}

const IMAGE_CONFIG = {
  landscape: {
    width: 1600,
    height: 1067,
    displayWidth: 960,
    displayHeight: 640,
  },
  portrait: {
    width: 900,
    height: 1600,
    displayWidth: 450,
    displayHeight: 800,
  }
};

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly localeService = inject(LocaleService);
  private readonly el = inject(ElementRef);
  private observer?: IntersectionObserver;
  private prefersReducedMotion = false;
  private readonly isBrowser = typeof window !== 'undefined';

  readonly selectedCategory = signal<PortfolioCategory>('all');

  readonly portfolioImages: PortfolioImage[] = [
    {
      id: 'img-1',
      filename: '342493F6-9858-4FF3-8553-165FDDEE1C1A_zvhb4c',
      titleEn: 'Turf Club Morning',
      titleZh: '晨光下的跑马场',
      locationEn: 'Penang, Malaysia',
      locationZh: '马来西亚·槟城',
      year: '2025',
      category: 'travel',
      gear: '24-120mm f/4',
      alt: 'Penang turf club in morning light',
      orientation: 'portrait',
    },
    {
      id: 'img-2',
      filename: 'DSC_8304_yaviii',
      titleEn: 'Heritage Calligraphy',
      titleZh: '手书墨香',
      locationEn: 'George Town, Penang',
      locationZh: '槟城·乔治市',
      year: '2026',
      category: 'street',
      gear: '40mm f/2',
      alt: 'Chinese calligraphy artisan at work in heritage shophouse',
      orientation: 'portrait',
    },
    {
      id: 'img-3',
      filename: 'DBCAC56F-3EFB-47B5-9D80-8D1C45E51D69_1_201_a_kxcy30',
      titleEn: 'Ljubljana Botanical Garden',
      titleZh: '卢布尔雅那植物园',
      locationEn: 'Ljubljana, Slovenia',
      locationZh: '斯洛文尼亚·卢布尔雅那',
      year: '2025',
      category: 'travel',
      gear: '24-120mm f/4',
      alt: 'Slovenia lush garden path with morning dew',
      orientation: 'landscape',
    },
    {
      id: 'img-4',
      filename: 'DAFB274E-FB95-4CCC-A14E-4280BCF76EF9_1_201_a_gfp8b6',
      titleEn: 'Ljubljanica River Terrace',
      titleZh: '卢布尔雅那河畔露台',
      locationEn: 'Ljubljana, Slovenia',
      locationZh: '斯洛文尼亚·卢布尔雅那',
      year: '2025',
      category: 'travel',
      gear: '40mm f/2',
      alt: 'Riverside outdoor cafe terrace along Ljubljanica river',
      orientation: 'landscape',
    },
    {
      id: 'img-5',
      filename: 'DSC_6571_bcbsh3',
      titleEn: 'Daily Flat White',
      titleZh: '晨间澳白拉花',
      locationEn: 'Orcabrew, Penang',
      locationZh: '槟城·Orcabrew',
      year: '2026',
      category: 'still_life',
      gear: '40mm f/2',
      alt: 'Artisanal latte art in ceramic cup at Orcabrew specialty coffee',
      orientation: 'portrait',
    },
    {
      id: 'img-6',
      filename: 'DSC_4441_xd08rs',
      titleEn: 'Tofu by Sunlight',
      titleZh: '窗边暖阳下的豆腐',
      locationEn: 'Penang, Malaysia',
      locationZh: '马来西亚·槟城',
      year: '2026',
      category: 'still_life',
      gear: '40mm f/2',
      alt: 'Cat Tofu resting serenely in soft window light',
      orientation: 'portrait',
    },
    {
      id: 'img-7',
      filename: 'DSC_2288_cl07yk',
      titleEn: 'Cascades of Plitvice',
      titleZh: '十六湖层叠流瀑',
      locationEn: 'Plitvice Lakes, Croatia',
      locationZh: '克罗地亚·普利特维采湖群',
      year: '2025',
      category: 'travel',
      gear: '24-120mm f/4',
      alt: 'Plitvice lakes turquoise waterfalls and wooden boardwalk',
      orientation: 'landscape',
    },
    {
      id: 'img-8',
      filename: 'DSC_6568_itj93l',
      titleEn: 'Pourover Ritual',
      titleZh: '手冲萃取余韵',
      locationEn: 'Orcabrew, Penang',
      locationZh: '槟城·Orcabrew',
      year: '2026',
      category: 'still_life',
      gear: '40mm f/2',
      alt: 'Pourover coffee dripper and glass decanter on wooden counter',
      orientation: 'landscape',
    },
    {
      id: 'img-9',
      filename: 'DSC_8946_jhxn2z',
      titleEn: 'Old Town Shophouses',
      titleZh: '合艾老城街角',
      locationEn: 'Hatyai, Thailand',
      locationZh: '泰国·合艾',
      year: '2025',
      category: 'street',
      gear: '40mm f/2',
      alt: 'Heritage alleyway and warm light at Hatyai old town',
      orientation: 'portrait',
    },
    {
      id: 'img-10',
      filename: 'F394B6A9-56B6-4311-BF67-9A9C89C56432_1_201_a_joxd24',
      titleEn: 'Piazza San Marco Twilight',
      titleZh: '圣马可暮色',
      locationEn: 'Venice, Italy',
      locationZh: '意大利·威尼斯',
      year: '2025',
      category: 'travel',
      gear: '24-120mm f/4',
      alt: 'St Mark\'s Campanile bell tower against dusk twilight in Venice',
      orientation: 'landscape',
    },
    {
      id: 'img-11',
      filename: '10F083D5-4714-4AEC-AA31-2BC8ADBB55FF_wjirvo',
      titleEn: 'Balik Pulau Shoreline',
      titleZh: '浮罗山背落日海岸',
      locationEn: 'Malindo Beach, Penang',
      locationZh: '槟城·浮罗山背',
      year: '2026',
      category: 'street',
      gear: '24-120mm f/4',
      alt: 'Sunset glow with wooden coastal pier at Malindo beach Balik Pulau',
      orientation: 'portrait',
    },
    {
      id: 'img-12',
      filename: '39EF5CFF-BC2E-469B-AFB4-68F5B029A6AF_y5cc6c',
      titleEn: 'Solitary Moon Over Strait',
      titleZh: '海峡孤月',
      locationEn: 'Penang Strait',
      locationZh: '马来西亚·槟城海峡',
      year: '2026',
      category: 'travel',
      gear: '120mm f/4',
      alt: 'Crescent moon suspended in deep midnight gradient',
      orientation: 'landscape',
    }
  ];

  readonly filteredImages = computed<PortfolioImage[]>(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') {
      return this.portfolioImages;
    }
    return this.portfolioImages.filter((img) => img.category === cat);
  });

  private readonly cloudinaryBasePrefix = 'https://res.cloudinary.com/dbdetsjli/image/upload/';

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    Fancybox.bind('[data-fancybox="gallery"]', {
      Carousel: {
        infinite: true,
      },
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: [],
          right: ['slideshow', 'thumbs', 'close'],
        },
      },
    });

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.prefersReducedMotion) {
      this.el.nativeElement.querySelectorAll('.reveal-image').forEach((el: HTMLElement) => {
        el.classList.add('revealed');
      });
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    this.observeImages();
  }

  setCategory(category: PortfolioCategory): void {
    this.selectedCategory.set(category);
    setTimeout(() => {
      this.observeImages();
    }, 50);
  }

  private observeImages(): void {
    if (!this.isBrowser || this.prefersReducedMotion || !this.observer) {
      return;
    }

    this.el.nativeElement.querySelectorAll('.reveal-image:not(.revealed)').forEach((el: HTMLElement) => {
      this.observer?.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.isBrowser && typeof (Fancybox as any).unbind === 'function') {
      try {
        (Fancybox as any).unbind('[data-fancybox="gallery"]');
      } catch {
        // no-op in test/ssr environments
      }
    }
  }

  getImageConfig(image: PortfolioImage) {
    return IMAGE_CONFIG[image.orientation];
  }

  getDisplayWidth(image: PortfolioImage): number {
    return this.getImageConfig(image).displayWidth;
  }

  getDisplayHeight(image: PortfolioImage): number {
    return this.getImageConfig(image).displayHeight;
  }

  getOriginalWidth(image: PortfolioImage): number {
    return this.getImageConfig(image).width;
  }

  getOriginalHeight(image: PortfolioImage): number {
    return this.getImageConfig(image).height;
  }

  getCloudinaryUrl(filename: string, width: number, height: number): string {
    return `${this.cloudinaryBasePrefix}w_${width},h_${height},c_fit,q_auto,f_auto/${filename}`;
  }

  getDisplayUrl(image: PortfolioImage): string {
    return this.getCloudinaryUrl(
      image.filename, 
      this.getDisplayWidth(image), 
      this.getDisplayHeight(image)
    );
  }

  getFullSizeUrl(image: PortfolioImage): string {
    return this.getCloudinaryUrl(
      image.filename, 
      this.getOriginalWidth(image), 
      this.getOriginalHeight(image)
    );
  }

  getImageTitle(image: PortfolioImage): string {
    return this.localeService.isChinese() ? image.titleZh : image.titleEn;
  }

  getImageLocation(image: PortfolioImage): string {
    return this.localeService.isChinese() ? image.locationZh : image.locationEn;
  }

  getImageCaption(image: PortfolioImage): string {
    const title = this.getImageTitle(image);
    const location = this.getImageLocation(image);
    return `${title}, ${location}, ${image.year} (${image.gear})`;
  }
}
