import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremiumAuthPage } from './premium-auth.page';

describe('PremiumAuthPage', () => {
  let component: PremiumAuthPage;
  let fixture: ComponentFixture<PremiumAuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PremiumAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
