import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPartnerRegisterPage } from './business-partner-register.page';

describe('BusinessPartnerRegisterPage', () => {
  let component: BusinessPartnerRegisterPage;
  let fixture: ComponentFixture<BusinessPartnerRegisterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BusinessPartnerRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
