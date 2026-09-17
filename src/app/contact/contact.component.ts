import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ENQUIRY_LIMITS, type ApiError, type EnquiryField } from '../../../shared/api-types';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly limits = ENQUIRY_LIMITS;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(ENQUIRY_LIMITS.name.max)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(ENQUIRY_LIMITS.email.max)]],
    subject: ['', [Validators.required, Validators.maxLength(ENQUIRY_LIMITS.subject.max)]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(ENQUIRY_LIMITS.message.min),
        Validators.maxLength(ENQUIRY_LIMITS.message.max),
      ],
    ],
    // Honeypot: visually hidden; only bots fill it in.
    website: [''],
  });

  readonly state = signal<SubmitState>('idle');
  readonly errorMessage = signal('');
  readonly serverErrors = signal<ApiError['details']>({});

  submit(): void {
    if (this.state() === 'sending') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('sending');
    this.serverErrors.set({});

    this.http.post('/api/enquiries', this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset();
        this.state.set('sent');
      },
      error: (err: HttpErrorResponse) => {
        const body = err.error as ApiError | null;
        this.serverErrors.set(body?.details ?? {});
        this.errorMessage.set(body?.error ?? 'Your message could not be sent. Please try again.');
        this.state.set('error');
      },
    });
  }

  sendAnother(): void {
    this.state.set('idle');
  }

  /** Server errors win; otherwise show client-side validation once the field is touched. */
  fieldError(field: EnquiryField): string | null {
    const server = this.serverErrors()?.[field];
    if (server) return server;

    const control = this.form.controls[field];
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Enter a valid email address';
    if (control.hasError('minlength')) return `Must be at least ${ENQUIRY_LIMITS[field].min} characters`;
    if (control.hasError('maxlength')) return `Must be at most ${ENQUIRY_LIMITS[field].max} characters`;
    return null;
  }
}
