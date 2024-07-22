import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPremiumPage } from './registro-premium.page';

describe('RegistroPremiumPage', () => {
  let component: RegistroPremiumPage;
  let fixture: ComponentFixture<RegistroPremiumPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistroPremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
