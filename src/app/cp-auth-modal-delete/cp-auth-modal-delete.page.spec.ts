import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpAuthModalDeletePage } from './cp-auth-modal-delete.page';

describe('CpAuthModalDeletePage', () => {
  let component: CpAuthModalDeletePage;
  let fixture: ComponentFixture<CpAuthModalDeletePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CpAuthModalDeletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
