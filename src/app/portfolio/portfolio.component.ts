import { Component, OnInit } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { NgOptimizedImage, NgFor } from '@angular/common';

interface PortfolioImage {
  filename: string;
  alt: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, NgFor]
})
export class PortfolioComponent implements OnInit {
  ngOnInit(): void {
    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      // Custom options
      Carousel: {
        infinite: true,
      },
    });
  }
  
  private readonly cloudinaryBasePrefix = 'https://res.cloudinary.com/dbdetsjli/image/upload/';
  
  getCloudinaryUrl(filename: string, width: number, height: number): string {
    const url = `${this.cloudinaryBasePrefix}w_${width},h_${height},c_fit,q_auto,f_auto/${filename}`;
    return url;
  }
  
  portfolioImages: PortfolioImage[] = [
    {
      filename: '342493F6-9858-4FF3-8553-165FDDEE1C1A_zvhb4c',
      alt: 'Penang turf club',
      width: 900,
      height: 1600
    },
    {
      filename: 'DSC_8304_yaviii',
      alt: 'Chinese calligraphy',
      width: 900,
      height: 1600
    },
    {
      filename: 'DBCAC56F-3EFB-47B5-9D80-8D1C45E51D69_1_201_a_kxcy30',
      alt: 'Slovenia garden',
      width: 1600,
      height: 1067
    },
    {
      filename: 'DAFB274E-FB95-4CCC-A14E-4280BCF76EF9_1_201_a_gfp8b6',
      alt: 'Slovenia cafe',
      width: 1600,
      height: 1067
    },
    {
      filename: 'DSC_6571_bcbsh3',
      alt: 'latte, Orcabrew, Penang',
      width: 900,
      height: 1600
    },
    {
      filename: 'DSC_4441_xd08rs',
      alt: 'Tofu',
      width: 900,
      height: 1600
    },
    {
      filename: 'DSC_2288_cl07yk',
      alt: 'Plitvice lakes, Croatia, timelapse, waterfall',
      width: 1600,
      height: 1067
    },
    {
      filename: 'DSC_6568_itj93l',
      alt: 'Coffe milk, Orcabrew, Penang',
      width: 1600,
      height: 1067
    },
    {
      filename: 'DSC_8946_jhxn2z',
      alt: 'Hatyai Lee\'s garden',
      width: 900,
      height: 1600
    },
    {
      filename: 'F394B6A9-56B6-4311-BF67-9A9C89C56432_1_201_a_joxd24',
      alt: 'St Mark\'s Campanile',
      width: 1600,
      height: 1067
    },
    {
      filename: '10F083D5-4714-4AEC-AA31-2BC8ADBB55FF_wjirvo',
      alt: 'Malindo beach, Balik Pulau',
      width: 900,
      height: 1600
    },
    // {
    //   filename: '9939D92A-D983-46D4-A3AC-736A5FEC6E16_1_201_a_wn5avg',
    //   alt: 'Plitvice lakes, Croatia',
    //   width: 1600,
    //   height: 1067
    // },
    {
      filename: '39EF5CFF-BC2E-469B-AFB4-68F5B029A6AF_y5cc6c',
      alt: 'Moon',
      width: 1600,
      height: 1067
    }
  ];
}
