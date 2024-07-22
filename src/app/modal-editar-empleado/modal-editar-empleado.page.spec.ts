import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarEmpleadoPage } from './modal-editar-empleado.page';

describe('ModalEditarEmpleadoPage', () => {
  let component: ModalEditarEmpleadoPage;
  let fixture: ComponentFixture<ModalEditarEmpleadoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalEditarEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
