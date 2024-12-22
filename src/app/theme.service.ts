export class ThemeService {
  private readonly themeKey = 'user-theme';

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

  toggleDarkMode(): void {
    const isDarkMode = !document.body.classList.contains('dark-mode');
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
    document.body.classList.toggle('dark-mode', isDarkMode);
  }
}
