import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlogListComponent } from './blog-list.component';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the writings headline', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.page-title')?.textContent).toContain('Writings');
  });

  it('should render one reading-time column per episode with totals in the headline', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-series-chart .column').length).toBe(5);
    expect(el.querySelectorAll('app-series-chart .column.is-live').length).toBe(1);
    expect(el.querySelector('app-series-chart .chart-title')?.textContent).toContain('35 minutes end to end, 5 already live');
  });

  it('should list all 5 posts', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.post-item').length).toBe(5);
  });

  it('should link only the published post to its detail route', () => {
    const el = fixture.nativeElement as HTMLElement;
    const links = el.querySelectorAll('.title-link');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/blog/three-ways-an-llm-responds');
  });

  it('should switch language reactively to Chinese', () => {
    component.localeService.setLocale('zh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.page-title')?.textContent).toContain('专栏文章');
    expect(el.textContent).toContain('大模型回答你的三种方式');
    expect(el.textContent).not.toContain('槟城');
  });
});
