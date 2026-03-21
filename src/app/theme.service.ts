import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'user-theme';
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  private readonly isBrowser =
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof localStorage !== 'undefined';
  
  isDarkTheme$: Observable<boolean> = this.isDarkThemeSubject.asObservable();
  
  constructor() {
    if (!this.isBrowser) {
      return;
    }

    this.applyUserOrSystemTheme();
    this.listenForSystemThemeChanges();
  }
  
  applyUserOrSystemTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    const userPreference = localStorage.getItem(this.themeKey);
    if (userPreference) {
      this.applyTheme(userPreference === 'dark');
    } else {
      this.applySystemTheme();
    }
  }
  
  toggleTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    const isDarkMode = !document.documentElement.classList.contains('dark');
    this.applyTheme(isDarkMode);
    localStorage.setItem(this.themeKey, isDarkMode ? 'dark' : 'light');
  }
  
  applySystemTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(isSystemDark);
  }
  
  listenForSystemThemeChanges(): void {
    if (!this.isBrowser) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (event) => {
      if (!localStorage.getItem(this.themeKey)) {
        this.applyTheme(event.matches);
      }
    });
  }
  
  private applyTheme(isDarkMode: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    document.documentElement.classList.toggle('dark', isDarkMode);
    this.isDarkThemeSubject.next(isDarkMode);
  }
}
