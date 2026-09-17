import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SamplePostComponent } from './sample-post.component';

describe('SamplePostComponent', () => {
  let component: SamplePostComponent;
  let fixture: ComponentFixture<SamplePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplePostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the post title and author', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.post-title')?.textContent).toContain(
      'Decoupling the Brain from the Hands'
    );
    expect(el.querySelector('.author-badge')?.textContent).toContain('Chong Wei Khang');
  });

  it('should render editorial graphics within the article', () => {
    const el = fixture.nativeElement as HTMLElement;
    const graphics = el.querySelectorAll('app-editorial-graphic');
    expect(graphics.length).toBe(3);
  });

  it('should render the portfolio back link', () => {
    const el = fixture.nativeElement as HTMLElement;
    const backLink = el.querySelector('.back-link');
    expect(backLink?.getAttribute('routerLink')).toBe('/');
  });
});
