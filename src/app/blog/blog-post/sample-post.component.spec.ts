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

  it('should render the writings back link', () => {
    const el = fixture.nativeElement as HTMLElement;
    const backLink = el.querySelector('.back-link');
    expect(backLink?.getAttribute('routerLink')).toBe('/blog');
  });

  it('should render desktop series sidebar and mobile series section', () => {
    const el = fixture.nativeElement as HTMLElement;
    const sidebar = el.querySelector('.desktop-series-sidebar');
    const mobileSection = el.querySelector('.mobile-series-section');
    expect(sidebar).toBeTruthy();
    expect(mobileSection).toBeTruthy();
    expect(sidebar?.textContent).toContain('How agents work');
    expect(sidebar?.textContent).toContain('01');
    expect(sidebar?.textContent).toContain('05');
  });

  it('should reactively switch content to Chinese when locale changes', () => {
    component.localeService.setLocale('zh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.post-title')?.textContent).toContain(
      '大模型回答你的三种方式'
    );
    expect(el.querySelector('.post-lead')?.textContent).toContain('你问聊天机器人一个问题');
    expect(el.querySelector('.author-badge')?.textContent).toContain('张炜康');
  });
});
