import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorialGraphicComponent } from './editorial-graphic.component';

describe('EditorialGraphicComponent', () => {
  let component: EditorialGraphicComponent;
  let fixture: ComponentFixture<EditorialGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorialGraphicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorialGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the default decoupled variant SVG', () => {
    const el = fixture.nativeElement as HTMLElement;
    const text = el.textContent;
    expect(text).toContain('AGENT HARNESS (BRAIN)');
    expect(text).toContain('SANDBOX TOOLS (HANDS)');
  });

  it('should render caption when provided', () => {
    fixture.componentRef.setInput('caption', 'Figure 1: Architectural decoupling of state and compute');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const captionEl = el.querySelector('figcaption');
    expect(captionEl?.textContent).toContain('Figure 1: Architectural decoupling of state and compute');
  });

  it('should switch archetypes cleanly', () => {
    fixture.componentRef.setInput('variant', 'layers');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('ORCHESTRATION & HARNESS LAYER');
    expect(el.textContent).toContain('DURABLE SESSION STORE');
  });

  it('should render Chinese labels when locale is zh', () => {
    component.localeService?.setLocale('zh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('智能体调度中枢');
    expect(el.textContent).toContain('执行工具沙箱');
  });
});
