import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { NgOptimizedImage } from '@angular/common';

interface PortfolioImage {
  filename: string;
  alt: string;
  orientation: 'landscape' | 'portrait';
}

// Standardized dimensions for different orientations
const IMAGE_CONFIG = {
  landscape: {
    width: 1600,
    height: 1067,
    displayWidth: 960,  // 60% of original
    displayHeight: 640, // 60% of original
  },
  portrait: {
    width: 900,
    height: 1600,
    displayWidth: 450,  // 50% of original
    displayHeight: 800, // 50% of original
  }
};

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage]
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private prefersReducedMotion = false;
  private readonly isBrowser = typeof window !== 'undefined';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    Fancybox.bind("[data-fancybox]", {
      Carousel: {
        infinite: true,
      },
    });

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.prefersReducedMotion) {
      // Show all images immediately for reduced motion users
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

    this.el.nativeElement.querySelectorAll('.reveal-image').forEach((el: HTMLElement) => {
      this.observer?.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  
  private readonly cloudinaryBasePrefix = 'https://res.cloudinary.com/dbdetsjli/image/upload/';
  
  // Get dimensions based on the image orientation
  getImageConfig(image: PortfolioImage) {
    return IMAGE_CONFIG[image.orientation];
  }
  
  // Get display width for the image
  getDisplayWidth(image: PortfolioImage): number {
    return this.getImageConfig(image).displayWidth;
  }
  
  // Get display height for the image
  getDisplayHeight(image: PortfolioImage): number {
    return this.getImageConfig(image).displayHeight;
  }
  
  // Get original width for the image
  getOriginalWidth(image: PortfolioImage): number {
    return this.getImageConfig(image).width;
  }
  
  // Get original height for the image
  getOriginalHeight(image: PortfolioImage): number {
    return this.getImageConfig(image).height;
  }
  
  // Get cloudinary URL with webP format
  getCloudinaryUrl(filename: string, width: number, height: number): string {
    const url = `${this.cloudinaryBasePrefix}w_${width},h_${height},c_fit,q_auto,f_auto/${filename}`;
    return url;
  }
  
  // Get smaller display URL for initial grid view
  getDisplayUrl(image: PortfolioImage): string {
    return this.getCloudinaryUrl(
      image.filename, 
      this.getDisplayWidth(image), 
      this.getDisplayHeight(image)
    );
  }
  
  // Get full size URL for Fancybox
  getFullSizeUrl(image: PortfolioImage): string {
    return this.getCloudinaryUrl(
      image.filename, 
      this.getOriginalWidth(image), 
      this.getOriginalHeight(image)
    );
  }
  
  portfolioImages: PortfolioImage[] = [
    {
      filename: '342493F6-9858-4FF3-8553-165FDDEE1C1A_zvhb4c',
      alt: 'Penang turf club',
      orientation: 'portrait',
    },
    {
      filename: 'DSC_8304_yaviii',
      alt: 'Chinese calligraphy',
      orientation: 'portrait',
    },
    {
      filename: 'DBCAC56F-3EFB-47B5-9D80-8D1C45E51D69_1_201_a_kxcy30',
      alt: 'Slovenia garden',
      orientation: 'landscape',
    },
    {
      filename: 'DAFB274E-FB95-4CCC-A14E-4280BCF76EF9_1_201_a_gfp8b6',
      alt: 'Slovenia cafe',
      orientation: 'landscape',
    },
    {
      filename: 'DSC_6571_bcbsh3',
      alt: 'latte, Orcabrew, Penang',
      orientation: 'portrait',
    },
    {
      filename: 'DSC_4441_xd08rs',
      alt: 'Tofu',
      orientation: 'portrait',
    },
    {
      filename: 'DSC_2288_cl07yk',
      alt: 'Plitvice lakes, Croatia, timelapse, waterfall',
      orientation: 'landscape',
    },
    {
      filename: 'DSC_6568_itj93l',
      alt: 'Coffe milk, Orcabrew, Penang',
      orientation: 'landscape',
    },
    {
      filename: 'DSC_8946_jhxn2z',
      alt: 'Hatyai Lee\'s garden',
      orientation: 'portrait',
    },
    {
      filename: 'F394B6A9-56B6-4311-BF67-9A9C89C56432_1_201_a_joxd24',
      alt: 'St Mark\'s Campanile',
      orientation: 'landscape',
    },
    {
      filename: '10F083D5-4714-4AEC-AA31-2BC8ADBB55FF_wjirvo',
      alt: 'Malindo beach, Balik Pulau',
      orientation: 'portrait',
    },
    {
      filename: '39EF5CFF-BC2E-469B-AFB4-68F5B029A6AF_y5cc6c',
      alt: 'Moon',
      orientation: 'landscape',
    }
  ];
}
