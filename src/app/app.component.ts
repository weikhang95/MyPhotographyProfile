import { Component } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterOutlet } from '@angular/router';
// import { ThemeService } from './theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [TopbarComponent, RouterOutlet]
})
export class AppComponent {
  // constructor(private _themeService: ThemeService) {}

  // toggleTheme(): void {
  //   this._themeService.toggleDarkMode();
  // }
}
