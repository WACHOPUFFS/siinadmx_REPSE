import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensualUploadPage } from './mensual-upload.page';

describe('MensualUploadPage', () => {
  let component: MensualUploadPage;
  let fixture: ComponentFixture<MensualUploadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MensualUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
