import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentManagementPage } from './department-management.page';

describe('DepartmentManagementPage', () => {
  let component: DepartmentManagementPage;
  let fixture: ComponentFixture<DepartmentManagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DepartmentManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
