import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { passthroughImageLoaderProvider } from '../image-loader';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        provideRouter([]),
        passthroughImageLoaderProvider,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all 12 images directly in the photo stream', () => {
    expect(component.filteredImages().length).toBe(12);
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.photo-item');
    expect(items.length).toBe(12);
  });

  it('should filter images by category when series links are clicked', () => {
    component.setCategory('street');
    fixture.detectChanges();
    expect(component.selectedCategory()).toBe('street');
    expect(component.filteredImages().every(img => img.category === 'street')).toBe(true);
    expect(component.filteredImages().length).toBeGreaterThan(0);
  });

  it('should switch between English and Chinese titles reactively', () => {
    const firstImg = component.portfolioImages[0];
    component.localeService.setLocale('en');
    expect(component.getImageTitle(firstImg)).toBe('Turf Club Morning');
    expect(component.getImageLocation(firstImg)).toBe('Penang, Malaysia');

    component.localeService.setLocale('zh');
    expect(component.getImageTitle(firstImg)).toBe('晨光下的跑马场');
    expect(component.getImageLocation(firstImg)).toBe('马来西亚·槟城');
  });

  it('should present pure photographs with clean series nav and zero caption clutter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.series-nav')).toBeTruthy();
    expect(compiled.querySelector('.photo-stream')).toBeTruthy();
    // Verify no template card boxes or self-intro clutter
    expect(compiled.querySelector('.identity-strip')).toBeNull();
    expect(compiled.querySelector('.photo-meta')).toBeNull();
    expect(compiled.querySelector('.writing-bridge-card')).toBeNull();
  });
});
