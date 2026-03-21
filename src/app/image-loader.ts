import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

export const passthroughImageLoader = (config: ImageLoaderConfig): string => config.src;

export const passthroughImageLoaderProvider = {
  provide: IMAGE_LOADER,
  useValue: passthroughImageLoader,
};
