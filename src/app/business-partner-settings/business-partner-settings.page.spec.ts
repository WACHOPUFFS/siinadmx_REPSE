import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPartnerSettingsPage } from './business-partner-settings.page';

describe('BusinessPartnerSettingsPage', () => {
  let component: BusinessPartnerSettingsPage;
  let fixture: ComponentFixture<BusinessPartnerSettingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BusinessPartnerSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
