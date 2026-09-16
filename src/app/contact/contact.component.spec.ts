import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let http: HttpTestingController;

  const validEnquiry = {
    name: 'Alice',
    email: 'alice@example.com',
    subject: 'Wedding shoot',
    message: 'Are you available in December?',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('does not send an invalid form', () => {
    component.submit();

    http.expectNone('/api/enquiries');
    expect(component.fieldError('email')).toBe('This field is required');
  });

  it('posts a valid enquiry and shows the sent state', () => {
    component.form.setValue({ ...validEnquiry, website: '' });
    component.submit();

    const request = http.expectOne('/api/enquiries');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ ...validEnquiry, website: '' });

    request.flush({ ok: true, id: 1 }, { status: 201, statusText: 'Created' });
    expect(component.state()).toBe('sent');
  });

  it('shows validation errors returned by the API', () => {
    component.form.setValue({ ...validEnquiry, email: 'alice@example', website: '' });
    component.submit();

    http.expectOne('/api/enquiries').flush(
      { error: 'Please fix the highlighted fields', details: { email: 'Enter a valid email address' } },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    expect(component.state()).toBe('error');
    expect(component.fieldError('email')).toBe('Enter a valid email address');
  });
});
