import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFilesPage } from './upload-files.page';

describe('UploadFilesPage', () => {
  let component: UploadFilesPage;
  let fixture: ComponentFixture<UploadFilesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadFilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
