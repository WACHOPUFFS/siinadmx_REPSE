import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpAuthModalPage } from './cp-auth-modal.page';

describe('CpAuthModalPage', () => {
  let component: CpAuthModalPage;
  let fixture: ComponentFixture<CpAuthModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CpAuthModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
