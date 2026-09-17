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
      'The Three Ways an LLM Responds'
    );
    expect(el.querySelector('.author-badge')?.textContent).toContain('Chong Wei Khang');
  });

  it('should render code windows and comparison table within the article', () => {
    const el = fixture.nativeElement as HTMLElement;
    const codeWindows = el.querySelectorAll('.code-window');
    expect(codeWindows.length).toBeGreaterThanOrEqual(4);
    const table = el.querySelector('.comparison-table');
    expect(table).toBeTruthy();
  });

  it('should render the portfolio back link', () => {
    const el = fixture.nativeElement as HTMLElement;
    const backLink = el.querySelector('.back-link');
    expect(backLink?.getAttribute('routerLink')).toBe('/');
  });

  it('should reactively switch content to Chinese when locale changes', () => {
    component.localeService.setLocale('zh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.post-title')?.textContent).toContain(
      '大模型输出的三种形态'
    );
    expect(el.querySelector('.post-lead')?.textContent).toContain('大多数人以为大模型只是在“打字吐字”');
    expect(el.querySelector('.author-badge')?.textContent).toContain('张炜康');
  });
});
