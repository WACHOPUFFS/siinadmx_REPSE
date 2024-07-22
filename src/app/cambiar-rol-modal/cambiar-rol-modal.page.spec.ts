import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarRolModalPage } from './cambiar-rol-modal.page';

describe('CambiarRolModalPage', () => {
  let component: CambiarRolModalPage;
  let fixture: ComponentFixture<CambiarRolModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CambiarRolModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
