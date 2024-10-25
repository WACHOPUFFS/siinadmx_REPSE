import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnualUploadPage } from './anual-upload.page';

describe('AnualUploadPage', () => {
  let component: AnualUploadPage;
  let fixture: ComponentFixture<AnualUploadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnualUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
