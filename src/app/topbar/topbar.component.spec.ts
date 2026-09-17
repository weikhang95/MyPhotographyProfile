import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle language between EN and 中文', () => {
    expect(component.localeService.locale()).toBe('en');
    component.toggleLocale();
    expect(component.localeService.locale()).toBe('zh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('作品集');
    expect(el.textContent).toContain('专栏文章');

    component.toggleLocale();
    expect(component.localeService.locale()).toBe('en');
    fixture.detectChanges();
    expect(el.textContent).toContain('PORTFOLIO');
    expect(el.textContent).toContain('WRITINGS');
  });
});
