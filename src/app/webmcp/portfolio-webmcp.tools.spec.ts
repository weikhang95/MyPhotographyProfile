import { jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  PORTFOLIO_PHOTOS,
  searchPortfolioTool,
  getPhotographerProfileTool,
  navigateSiteTool,
  toggleThemeTool,
  providePortfolioWebMcp,
} from './portfolio-webmcp.tools';
import { ThemeService } from '../theme.service';

describe('WebMCP Tools', () => {
  describe('searchPortfolioTool', () => {
    it('should return all photos when no filter is provided', async () => {
      const result = (await searchPortfolioTool.execute({})) as {
        totalFound: number;
        photos: Array<unknown>;
      };
      expect(result.totalFound).toBe(PORTFOLIO_PHOTOS.length);
    });

    it('should filter photos by query (e.g. "coffee")', async () => {
      const result = (await searchPortfolioTool.execute({ query: 'coffee' })) as {
        totalFound: number;
        photos: Array<{ title: string }>;
      };
      expect(result.totalFound).toBeGreaterThan(0);
      expect(
        result.photos.some((p) => p.title.toLowerCase().includes('latte') || p.title.toLowerCase().includes('coffee'))
      ).toBe(true);
    });

    it('should filter photos by orientation', async () => {
      const result = (await searchPortfolioTool.execute({ orientation: 'portrait' })) as {
        totalFound: number;
        photos: Array<{ orientation: string }>;
      };
      expect(result.totalFound).toBeGreaterThan(0);
      expect(result.photos.every((p) => p.orientation === 'portrait')).toBe(true);
    });
  });

  describe('getPhotographerProfileTool', () => {
    it('should return profile information about Chong Wei Khang', async () => {
      const profile = (await getPhotographerProfileTool.execute()) as {
        name: string;
        location: string;
        cameraGear: { body: string };
      };
      expect(profile.name).toBe('Chong Wei Khang');
      expect(profile.location).toContain('Penang');
      expect(profile.cameraGear.body).toBe('Nikon Z5');
    });
  });

  describe('navigateSiteTool', () => {
    it('should navigate to valid page paths', async () => {
      const mockRouter = {
        navigateByUrl: jest.fn().mockResolvedValue(true),
      };

      TestBed.configureTestingModule({
        providers: [{ provide: Router, useValue: mockRouter }],
      });

      await TestBed.runInInjectionContext(async () => {
        const result = (await navigateSiteTool.execute({ destination: 'about' })) as {
          path: string;
          navigated: boolean;
        };
        expect(result.path).toBe('/about');
        expect(result.navigated).toBe(true);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/about');
      });
    });
  });

  describe('toggleThemeTool', () => {
    it('should toggle theme using ThemeService', async () => {
      const mockThemeService = {
        toggleTheme: jest.fn(),
      };

      TestBed.configureTestingModule({
        providers: [{ provide: ThemeService, useValue: mockThemeService }],
      });

      await TestBed.runInInjectionContext(async () => {
        const result = (await toggleThemeTool.execute({})) as { activeTheme: string };
        expect(mockThemeService.toggleTheme).toHaveBeenCalled();
        expect(result.activeTheme).toBeDefined();
      });
    });
  });

  describe('providePortfolioWebMcp', () => {
    it('should create environment providers without error', () => {
      const providers = providePortfolioWebMcp();
      expect(providers).toBeDefined();
    });
  });
});
