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

  it('should render the dual-track headings in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.about-title')?.textContent).toContain('About Me');
    expect(compiled.textContent).toContain('The Builder — Code & Systems');
    expect(compiled.textContent).toContain('The Observer — Light & Moments');
  });

  it('should reactively render Chinese content when locale changes', () => {
    component.localeService.setLocale('zh');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.about-title')?.textContent).toContain('关于我');
    expect(compiled.textContent).toContain('构建者 — 代码与系统架构');
    expect(compiled.textContent).toContain('观察者 — 光线与静止瞬间');
  });

  it('should render gear, milestones, and colophon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.gear-card')).toBeTruthy();
    expect(compiled.querySelector('.timeline-card')).toBeTruthy();
    expect(compiled.querySelector('.colophon-card')).toBeTruthy();
    expect(compiled.textContent).toContain('Nikon Z5');
  });
});
