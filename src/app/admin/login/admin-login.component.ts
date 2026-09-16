import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type { ApiError } from '../../../../shared/api-types';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);

  password = '';
  readonly sending = signal(false);
  readonly error = signal('');

  submit(): void {
    if (this.sending() || !this.password) return;

    this.sending.set(true);
    this.error.set('');

    this.api.login(this.password).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: (err: HttpErrorResponse) => {
        this.password = '';
        this.error.set((err.error as ApiError | null)?.error ?? 'Sign in failed. Please try again.');
        this.sending.set(false);
      },
    });
  }
}
