import { inject, Injector, ProviderToken } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ThemeService } from '../theme.service';

let fallbackInjector: Injector | null = null;

function safeInject<T>(token: ProviderToken<T>): T {
  try {
    return inject(token);
  } catch {
    if (fallbackInjector) {
      return fallbackInjector.get(token);
    }
    throw new Error(`Cannot resolve ${String(token)} outside injection context`);
  }
}

export interface PortfolioPhotoItem {
  readonly filename: string;
  readonly alt: string;
  readonly orientation: 'landscape' | 'portrait';
  readonly tags: readonly string[];
  readonly location?: string;
  readonly displayUrl: string;
  readonly fullSizeUrl: string;
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dbdetsjli/image/upload/';

function buildCloudinaryUrl(filename: string, width: number, height: number): string {
  return `${CLOUDINARY_BASE}w_${width},h_${height},c_fit,q_auto,f_auto/${filename}`;
}

export const PORTFOLIO_PHOTOS: readonly PortfolioPhotoItem[] = [
  {
    filename: '342493F6-9858-4FF3-8553-165FDDEE1C1A_zvhb4c',
    alt: 'Penang turf club',
    orientation: 'portrait',
    tags: ['penang', 'turf club', 'architecture', 'heritage', 'malaysia'],
    location: 'Penang, Malaysia',
    displayUrl: buildCloudinaryUrl('342493F6-9858-4FF3-8553-165FDDEE1C1A_zvhb4c', 450, 800),
    fullSizeUrl: buildCloudinaryUrl('342493F6-9858-4FF3-8553-165FDDEE1C1A_zvhb4c', 900, 1600),
  },
  {
    filename: 'DSC_8304_yaviii',
    alt: 'Chinese calligraphy',
    orientation: 'portrait',
    tags: ['chinese calligraphy', 'calligraphy', 'culture', 'art', 'tradition'],
    displayUrl: buildCloudinaryUrl('DSC_8304_yaviii', 450, 800),
    fullSizeUrl: buildCloudinaryUrl('DSC_8304_yaviii', 900, 1600),
  },
  {
    filename: 'DBCAC56F-3EFB-47B5-9D80-8D1C45E51D69_1_201_a_kxcy30',
    alt: 'Slovenia garden',
    orientation: 'landscape',
    tags: ['slovenia', 'garden', 'nature', 'landscape', 'travel', 'europe'],
    location: 'Slovenia',
    displayUrl: buildCloudinaryUrl('DBCAC56F-3EFB-47B5-9D80-8D1C45E51D69_1_201_a_kxcy30', 960, 640),
    fullSizeUrl: buildCloudinaryUrl('DBCAC56F-3EFB-47B5-9D80-8D1C45E51D69_1_201_a_kxcy30', 1600, 1067),
  },
  {
    filename: 'DAFB274E-FB95-4CCC-A14E-4280BCF76EF9_1_201_a_gfp8b6',
    alt: 'Slovenia cafe',
    orientation: 'landscape',
    tags: ['slovenia', 'cafe', 'coffee', 'lifestyle', 'travel', 'europe'],
    location: 'Slovenia',
    displayUrl: buildCloudinaryUrl('DAFB274E-FB95-4CCC-A14E-4280BCF76EF9_1_201_a_gfp8b6', 960, 640),
    fullSizeUrl: buildCloudinaryUrl('DAFB274E-FB95-4CCC-A14E-4280BCF76EF9_1_201_a_gfp8b6', 1600, 1067),
  },
  {
    filename: 'DSC_6571_bcbsh3',
    alt: 'latte, Orcabrew, Penang',
    orientation: 'portrait',
    tags: ['latte', 'orcabrew', 'penang', 'coffee', 'cafe', 'latte art'],
    location: 'Penang, Malaysia',
    displayUrl: buildCloudinaryUrl('DSC_6571_bcbsh3', 450, 800),
    fullSizeUrl: buildCloudinaryUrl('DSC_6571_bcbsh3', 900, 1600),
  },
  {
    filename: 'DSC_4441_xd08rs',
    alt: 'Tofu the cat',
    orientation: 'portrait',
    tags: ['tofu', 'cat', 'pet', 'animal'],
    displayUrl: buildCloudinaryUrl('DSC_4441_xd08rs', 450, 800),
    fullSizeUrl: buildCloudinaryUrl('DSC_4441_xd08rs', 900, 1600),
  },
  {
    filename: 'DSC_2288_cl07yk',
    alt: 'Plitvice lakes, Croatia, timelapse, waterfall',
    orientation: 'landscape',
    tags: ['plitvice', 'croatia', 'waterfall', 'lakes', 'national park', 'nature', 'travel'],
    location: 'Plitvice Lakes National Park, Croatia',
    displayUrl: buildCloudinaryUrl('DSC_2288_cl07yk', 960, 640),
    fullSizeUrl: buildCloudinaryUrl('DSC_2288_cl07yk', 1600, 1067),
  },
  {
    filename: 'DSC_6568_itj93l',
    alt: 'Coffee milk, Orcabrew, Penang',
    orientation: 'landscape',
    tags: ['coffee', 'milk', 'orcabrew', 'penang', 'cafe', 'beverage'],
    location: 'Penang, Malaysia',
    displayUrl: buildCloudinaryUrl('DSC_6568_itj93l', 960, 640),
    fullSizeUrl: buildCloudinaryUrl('DSC_6568_itj93l', 1600, 1067),
  },
  {
    filename: 'DSC_8946_jhxn2z',
    alt: 'Hatyai Lee\'s garden',
    orientation: 'portrait',
    tags: ['hatyai', 'thailand', 'travel', 'street', 'city'],
    location: 'Hat Yai, Thailand',
    displayUrl: buildCloudinaryUrl('DSC_8946_jhxn2z', 450, 800),
    fullSizeUrl: buildCloudinaryUrl('DSC_8946_jhxn2z', 900, 1600),
  },
  {
    filename: 'F394B6A9-56B6-4311-BF67-9A9C89C56432_1_201_a_joxd24',
    alt: 'St Mark\'s Campanile, Venice',
    orientation: 'landscape',
    tags: ['venice', 'italy', 'campanile', 'architecture', 'monument', 'travel', 'europe'],
    location: 'Venice, Italy',
    displayUrl: buildCloudinaryUrl('F394B6A9-56B6-4311-BF67-9A9C89C56432_1_201_a_joxd24', 960, 640),
    fullSizeUrl: buildCloudinaryUrl('F394B6A9-56B6-4311-BF67-9A9C89C56432_1_201_a_joxd24', 1600, 1067),
  },
  {
    filename: '10F083D5-4714-4AEC-AA31-2BC8ADBB55FF_wjirvo',
    alt: 'Malindo beach, Balik Pulau',
    orientation: 'portrait',
    tags: ['malindo beach', 'balik pulau', 'penang', 'beach', 'sunset', 'landscape', 'coast'],
    location: 'Balik Pulau, Penang, Malaysia',
    displayUrl: buildCloudinaryUrl('10F083D5-4714-4AEC-AA31-2BC8ADBB55FF_wjirvo', 450, 800),
    fullSizeUrl: buildCloudinaryUrl('10F083D5-4714-4AEC-AA31-2BC8ADBB55FF_wjirvo', 900, 1600),
  },
  {
    filename: '39EF5CFF-BC2E-469B-AFB4-68F5B029A6AF_y5cc6c',
    alt: 'Moon astrophotography',
    orientation: 'landscape',
    tags: ['moon', 'astrophotography', 'night', 'sky', 'space'],
    displayUrl: buildCloudinaryUrl('39EF5CFF-BC2E-469B-AFB4-68F5B029A6AF_y5cc6c', 960, 640),
    fullSizeUrl: buildCloudinaryUrl('39EF5CFF-BC2E-469B-AFB4-68F5B029A6AF_y5cc6c', 1600, 1067),
  },
];

export const searchPortfolioTool = {
  name: 'search_portfolio',
  description: 'Search Chong Wei Khang\'s photography portfolio by keyword, location, subject (e.g. Penang, Croatia, Slovenia, coffee, beach, cat), or orientation (landscape / portrait). Returns photos with direct URLs and captions.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Keyword, topic, or location to filter by (optional)',
      },
      orientation: {
        type: 'string',
        enum: ['landscape', 'portrait'],
        description: 'Filter by image orientation (optional)',
      },
    },
  } as const,
  execute: async (args: { query?: string; orientation?: 'landscape' | 'portrait' }) => {
    const q = (args.query ?? '').toLowerCase().trim();
    const orientation = args.orientation;

    const matches = PORTFOLIO_PHOTOS.filter((photo) => {
      if (orientation && photo.orientation !== orientation) {
        return false;
      }
      if (!q) {
        return true;
      }
      const inAlt = photo.alt.toLowerCase().includes(q);
      const inLocation = photo.location?.toLowerCase().includes(q) ?? false;
      const inTags = photo.tags.some((t) => t.toLowerCase().includes(q));
      return inAlt || inLocation || inTags;
    });

    return {
      totalFound: matches.length,
      photos: matches.map((m) => ({
        title: m.alt,
        orientation: m.orientation,
        location: m.location ?? 'Unspecified',
        tags: m.tags,
        previewUrl: m.displayUrl,
        fullSizeUrl: m.fullSizeUrl,
      })),
    };
  },
};

export const getPhotographerProfileTool = {
  name: 'get_photographer_profile',
  description: 'Retrieve Chong Wei Khang\'s biography, location, photography equipment, full-stack engineer background, and contact details.',
  inputSchema: {
    type: 'object',
    properties: {},
  } as const,
  execute: async () => {
    return {
      name: 'Chong Wei Khang',
      location: 'Penang, Malaysia',
      role: 'Senior Full Stack Developer & Photographer',
      biography:
        'Mechatronic Engineer turned Senior Full Stack Developer at ViTrox Corporation Berhad since 2019. Combines technical engineering with creative photography, capturing street, travel, landscapes, and coffee culture.',
      cameraGear: {
        body: 'Nikon Z5',
        lenses: ['NIKKOR Z 24-120mm f/4 S', 'NIKKOR Z 40mm f/2'],
      },
      interests: ['Photography', 'AI Agents & LLMs', 'Specialty Coffee', 'Anime'],
      socialLinks: {
        instagram: 'https://www.instagram.com/weikhang95',
        linkedin: 'https://www.linkedin.com/in/wei-khang-chong',
        unsplash: 'https://unsplash.com/@weikhang95',
        github: 'https://github.com/weikhang95',
      },
    };
  },
};

export const navigateSiteTool = {
  name: 'navigate_site',
  description: 'Navigate the website to a given route (portfolio, about, contact).',
  inputSchema: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        enum: ['portfolio', 'about', 'contact'],
        description: 'Page to navigate to: "portfolio" (/), "about" (/about), or "contact" (/contact)',
      },
    },
    required: ['destination'],
  } as const,
  execute: async (args: { destination: 'portfolio' | 'about' | 'contact' }) => {
    const router = safeInject(Router);
    const pathMap = {
      portfolio: '/',
      about: '/about',
      contact: '/contact',
    } as const;

    const path = pathMap[args.destination] ?? '/';
    const success = await router.navigateByUrl(path);
    return {
      destination: args.destination,
      path,
      navigated: success,
    };
  },
};

export const submitContactInquiryTool = {
  name: 'submit_contact_inquiry',
  description: 'Send a contact message or booking inquiry to photographer Chong Wei Khang.',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Name of the person inquiring' },
      email: { type: 'string', description: 'Valid email address for response' },
      subject: { type: 'string', description: 'Brief subject or reason for inquiry' },
      message: { type: 'string', description: 'Inquiry message, project details, or questions' },
    },
    required: ['name', 'email', 'subject', 'message'],
  } as const,
  execute: async (args: { name: string; email: string; subject: string; message: string }) => {
    const http = safeInject(HttpClient);
    try {
      const response = await firstValueFrom(
        http.post<{ success: boolean; id?: string }>('/api/enquiries', {
          name: args.name,
          email: args.email,
          subject: args.subject,
          message: args.message,
          website: '', // honeypot left blank
        })
      );
      return {
        status: 'success',
        message: 'Inquiry sent successfully to Chong Wei Khang.',
        response,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
      return {
        status: 'error',
        message: `Failed to submit inquiry: ${errorMsg}`,
      };
    }
  },
};

export const toggleThemeTool = {
  name: 'toggle_theme',
  description: 'Toggle or check dark/light mode for Chong Wei Khang\'s portfolio.',
  inputSchema: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['toggle', 'light', 'dark'],
        description: 'Action to take: toggle between modes, or explicitly set light or dark',
      },
    },
  } as const,
  execute: async (args: { mode?: 'toggle' | 'light' | 'dark' }) => {
    const themeService = safeInject(ThemeService);
    if (args.mode === 'light') {
      if (document.documentElement.classList.contains('dark')) {
        themeService.toggleTheme();
      }
    } else if (args.mode === 'dark') {
      if (!document.documentElement.classList.contains('dark')) {
        themeService.toggleTheme();
      }
    } else {
      themeService.toggleTheme();
    }
    const isDark = document.documentElement.classList.contains('dark');
    return {
      activeTheme: isDark ? 'dark' : 'light',
    };
  },
};

import {
  declareExperimentalWebMcpTool,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  EnvironmentProviders,
} from '@angular/core';

export const ALL_WEBMCP_TOOLS = [
  searchPortfolioTool,
  getPhotographerProfileTool,
  navigateSiteTool,
  submitContactInquiryTool,
  toggleThemeTool,
];

export function providePortfolioWebMcp(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      fallbackInjector = inject(Injector);
      if (typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>)['__WEBMCP_TOOLS__'] = ALL_WEBMCP_TOOLS;
      }
      declareExperimentalWebMcpTool(searchPortfolioTool);
      declareExperimentalWebMcpTool(getPhotographerProfileTool);
      declareExperimentalWebMcpTool(navigateSiteTool);
      declareExperimentalWebMcpTool(submitContactInquiryTool);
      declareExperimentalWebMcpTool(toggleThemeTool);
    }),
  ]);
}
