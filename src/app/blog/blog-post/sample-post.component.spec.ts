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

  it('should reactively switch content to Chinese when locale changes', () => {
    component.localeService.setLocale('zh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.post-title')?.textContent).toContain(
      '解耦思考与行动'
    );
    expect(el.querySelector('.post-lead')?.textContent).toContain('大模型能力快速迭代');
    expect(el.querySelector('.author-badge')?.textContent).toContain('张炜康');
  });
});
