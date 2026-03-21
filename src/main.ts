import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', loadComponent: () => import('./app/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'about', loadComponent: () => import('./app/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./app/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
  ]
}).catch(err => console.error(err));
