import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodManagementPage } from './period-management.page';

describe('PeriodManagementPage', () => {
  let component: PeriodManagementPage;
  let fixture: ComponentFixture<PeriodManagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PeriodManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
