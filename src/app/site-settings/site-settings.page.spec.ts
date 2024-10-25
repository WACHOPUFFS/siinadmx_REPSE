import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteSettingsPage } from './site-settings.page';

describe('SiteSettingsPage', () => {
  let component: SiteSettingsPage;
  let fixture: ComponentFixture<SiteSettingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SiteSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
