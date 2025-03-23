import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private readonly cloudinaryBasePrefix = 'https://res.cloudinary.com/dbdetsjli/image/upload/';

  getCloudinaryUrl(filename: string, width: number, height: number): string {
    return `${this.cloudinaryBasePrefix}w_${width},h_${height},c_fit,q_auto,f_auto/${filename}`;
  }

  profileImage = {
    filename: 'DSC07692_xzluao',
    alt: 'Wei Khang\'s profile picture',
    width: 800,
    height: 800
  };
}
