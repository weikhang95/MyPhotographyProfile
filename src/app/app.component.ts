import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterOutlet } from '@angular/router';
// import { ThemeService } from './theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TopbarComponent, RouterOutlet]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}
