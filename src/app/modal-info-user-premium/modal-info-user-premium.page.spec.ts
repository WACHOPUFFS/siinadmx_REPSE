import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalInfoUserPremiumPage } from './modal-info-user-premium.page';

describe('ModalInfoUserPremiumPage', () => {
  let component: ModalInfoUserPremiumPage;
  let fixture: ComponentFixture<ModalInfoUserPremiumPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalInfoUserPremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
