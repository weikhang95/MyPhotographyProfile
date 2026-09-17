import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created with default locale', () => {
    expect(service).toBeTruthy();
    expect(service.locale()).toBe('en');
    expect(service.isChinese()).toBe(false);
  });

  it('should toggle between en and zh cleanly', () => {
    expect(service.locale()).toBe('en');
    const next = service.toggleLocale();
    expect(next).toBe('zh');
    expect(service.locale()).toBe('zh');
    expect(service.isChinese()).toBe(true);
    expect(service.dict().lang.current).toBe('简体中文');

    const again = service.toggleLocale();
    expect(again).toBe('en');
    expect(service.locale()).toBe('en');
    expect(service.isChinese()).toBe(false);
  });

  it('should update html lang attribute when locale changes', () => {
    service.setLocale('zh');
    expect(document.documentElement.lang).toBe('zh-Hans');
    expect(document.documentElement.classList.contains('lang-zh')).toBe(true);

    service.setLocale('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.classList.contains('lang-zh')).toBe(false);
  });

  it('should return appropriate localized strings', () => {
    service.setLocale('en');
    expect(service.dict().nav.portfolio).toBe('PORTFOLIO');
    expect(service.dict().nav.writings).toBe('WRITINGS');

    service.setLocale('zh');
    expect(service.dict().nav.portfolio).toBe('作品集');
    expect(service.dict().nav.writings).toBe('专栏文章');
  });
});
