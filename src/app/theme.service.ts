import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'user-theme';
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  
  isDarkTheme$: Observable<boolean> = this.isDarkThemeSubject.asObservable();
  
  constructor() {
    this.applyUserOrSystemTheme();
    this.listenForSystemThemeChanges();
  }
  
  applyUserOrSystemTheme(): void {
    const userPreference = localStorage.getItem(this.themeKey);
    if (userPreference) {
      this.applyTheme(userPreference === 'dark');
    } else {
      this.applySystemTheme();
    }
  }
  
  toggleTheme(): void {
    const isDarkMode = !document.documentElement.classList.contains('dark');
    this.applyTheme(isDarkMode);
    localStorage.setItem(this.themeKey, isDarkMode ? 'dark' : 'light');
  }
  
  applySystemTheme(): void {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(isSystemDark);
  }
  
  listenForSystemThemeChanges(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (event) => {
      if (!localStorage.getItem(this.themeKey)) {
        this.applyTheme(event.matches);
      }
    });
  }
  
  private applyTheme(isDarkMode: boolean): void {
    document.documentElement.classList.toggle('dark', isDarkMode);
    this.isDarkThemeSubject.next(isDarkMode);
  }
}
