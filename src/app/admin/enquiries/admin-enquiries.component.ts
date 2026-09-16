import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { ApiError, Enquiry, EnquiryPage, EnquiryStatus } from '../../../../shared/api-types';
import { AdminApiService } from '../admin-api.service';

interface Tab {
  label: string;
  status: EnquiryStatus | null;
}

@Component({
  selector: 'app-admin-enquiries',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-enquiries.component.html',
  styleUrl: './admin-enquiries.component.scss',
})
export class AdminEnquiriesComponent {
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);

  readonly tabs: Tab[] = [
    { label: 'New', status: 'new' },
    { label: 'Read', status: 'read' },
    { label: 'Archived', status: 'archived' },
    { label: 'All', status: null },
  ];

  readonly status = signal<EnquiryStatus | null>('new');
  readonly page = signal(1);
  readonly data = signal<EnquiryPage | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly expandedId = signal<number | null>(null);

  readonly totalPages = computed(() => {
    const data = this.data();
    return data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.listEnquiries({ status: this.status(), page: this.page() }).subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err),
    });
  }

  tabCount(tab: Tab): number {
    const counts = this.data()?.counts;
    if (!counts) return 0;
    return tab.status ? counts[tab.status] : counts.new + counts.read + counts.archived;
  }

  selectTab(tab: Tab): void {
    this.status.set(tab.status);
    this.page.set(1);
    this.expandedId.set(null);
    this.load();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.expandedId.set(null);
    this.load();
  }

  /** Opening a new enquiry marks it as read. */
  toggle(enquiry: Enquiry): void {
    const opening = this.expandedId() !== enquiry.id;
    this.expandedId.set(opening ? enquiry.id : null);
    if (opening && enquiry.status === 'new') this.setStatus(enquiry, 'read');
  }

  setStatus(enquiry: Enquiry, status: EnquiryStatus): void {
    this.api.updateStatus(enquiry.id, status).subscribe({
      // Update in place (instead of reloading) so the row doesn't vanish from the current tab.
      next: (updated) =>
        this.data.update((data) =>
          data && {
            ...data,
            items: data.items.map((item) => (item.id === updated.id ? updated : item)),
            counts: {
              ...data.counts,
              [enquiry.status]: data.counts[enquiry.status] - 1,
              [updated.status]: data.counts[updated.status] + 1,
            },
          },
        ),
      error: (err) => this.handleError(err),
    });
  }

  remove(enquiry: Enquiry): void {
    if (!confirm(`Delete the enquiry from ${enquiry.name}? This cannot be undone.`)) return;

    this.api.deleteEnquiry(enquiry.id).subscribe({
      next: () => {
        const data = this.data();
        if (data && data.items.length === 1 && this.page() > 1) {
          this.goToPage(this.page() - 1);
        } else {
          this.load();
        }
      },
      error: (err) => this.handleError(err),
    });
  }

  replyLink(enquiry: Enquiry): string {
    return `mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`;
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => this.router.navigateByUrl('/admin/login'),
      error: () => this.router.navigateByUrl('/admin/login'),
    });
  }

  private handleError(err: HttpErrorResponse): void {
    this.loading.set(false);
    if (err.status === 401) {
      this.router.navigateByUrl('/admin/login');
      return;
    }
    this.error.set((err.error as ApiError | null)?.error ?? 'Something went wrong. Please try again.');
  }
}
