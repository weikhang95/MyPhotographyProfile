import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render author identity and English narrative by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.author-name')?.textContent).toContain('Chong Wei Khang');
    expect(compiled.querySelector('.author-subname')?.textContent).toContain('张炜康');
    expect(compiled.textContent).toContain('I have been a full-stack engineer at ViTrox');
    expect(compiled.textContent).toContain('Software engineer and photographer');
  });

  it('should reactively render Chinese content when locale changes', () => {
    component.localeService.setLocale('zh');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2019 年起在槟城 ViTrox 做全栈工程师');
    expect(compiled.textContent).toContain('软件工程师，也拍照');
    expect(compiled.textContent).toContain('这个网站');
  });

  it('should render environmental portrait, optics, timeline, and colophon without template card boxes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.portrait-photo')).toBeTruthy();
    expect(compiled.querySelectorAll('.hairline-section').length).toBeGreaterThanOrEqual(3);
    expect(compiled.textContent).toContain('Nikon Z5');
    expect(compiled.textContent).toContain('ViTrox');

    // Verify template card boxes are completely gone
    expect(compiled.querySelector('.portrait-card')).toBeNull();
    expect(compiled.querySelector('.gear-card')).toBeNull();
    expect(compiled.querySelector('.timeline-card')).toBeNull();
    expect(compiled.querySelector('.colophon-card')).toBeNull();
  });
});
