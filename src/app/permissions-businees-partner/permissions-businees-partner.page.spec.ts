import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionsBusineesPartnerPage } from './permissions-businees-partner.page';

describe('PermissionsBusineesPartnerPage', () => {
  let component: PermissionsBusineesPartnerPage;
  let fixture: ComponentFixture<PermissionsBusineesPartnerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PermissionsBusineesPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
