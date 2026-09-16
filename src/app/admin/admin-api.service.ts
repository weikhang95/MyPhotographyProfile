import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import type { Enquiry, EnquiryPage, EnquiryStatus } from '../../../shared/api-types';

/**
 * Talks to the admin API. The session lives in an HttpOnly cookie that the
 * browser attaches automatically, so no token handling is needed here.
 */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  login(password: string): Observable<unknown> {
    return this.http.post('/api/admin/login', { password });
  }

  logout(): Observable<unknown> {
    return this.http.post('/api/admin/logout', {});
  }

  /** Emits true when the current session is valid, false otherwise. */
  isSignedIn(): Observable<boolean> {
    return this.http.get('/api/admin/session').pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  listEnquiries(options: { status: EnquiryStatus | null; page: number }): Observable<EnquiryPage> {
    let params = new HttpParams().set('page', options.page);
    if (options.status) params = params.set('status', options.status);
    return this.http.get<EnquiryPage>('/api/admin/enquiries', { params });
  }

  updateStatus(id: number, status: EnquiryStatus): Observable<Enquiry> {
    return this.http.patch<Enquiry>(`/api/admin/enquiries/${id}`, { status });
  }

  deleteEnquiry(id: number): Observable<unknown> {
    return this.http.delete(`/api/admin/enquiries/${id}`);
  }
}
