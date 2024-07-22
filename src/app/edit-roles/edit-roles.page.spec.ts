import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRolesPage } from './edit-roles.page';

describe('EditRolesPage', () => {
  let component: EditRolesPage;
  let fixture: ComponentFixture<EditRolesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditRolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
