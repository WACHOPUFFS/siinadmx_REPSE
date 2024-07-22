import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarEmpresaModalPage } from './editar-empresa-modal.page';

describe('EditarEmpresaModalPage', () => {
  let component: EditarEmpresaModalPage;
  let fixture: ComponentFixture<EditarEmpresaModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarEmpresaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
