import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index.mjs';

setupZoneTestEnv();

const cloudinaryOrigin = 'https://res.cloudinary.com';

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];

    constructor(private readonly callback: IntersectionObserverCallback) {}

    disconnect(): void {}

    observe(target: Element): void {
      this.callback(
        [
          {
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target,
            time: Date.now(),
          },
        ],
        this
      );
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve(): void {}
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
}

if (!document.head.querySelector(`link[rel="preconnect"][href="${cloudinaryOrigin}"]`)) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = cloudinaryOrigin;
  document.head.appendChild(link);
}
