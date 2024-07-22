import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpAuthPage } from './cp-auth.page';

describe('CpAuthPage', () => {
  let component: CpAuthPage;
  let fixture: ComponentFixture<CpAuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CpAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
