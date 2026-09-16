import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';
import { passthroughImageLoaderProvider } from './app/image-loader';
import { adminGuard } from './app/admin/admin.guard';

const routes: Routes = [
  { path: '', loadComponent: () => import('./app/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'about', loadComponent: () => import('./app/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./app/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'admin/login', loadComponent: () => import('./app/admin/login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./app/admin/enquiries/admin-enquiries.component').then(m => m.AdminEnquiriesComponent) },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),passthroughImageLoaderProvider,
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ]
}).catch(err => console.error(err));
