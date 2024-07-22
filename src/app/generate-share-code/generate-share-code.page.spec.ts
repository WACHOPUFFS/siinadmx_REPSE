import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateShareCodePage } from './generate-share-code.page';

describe('GenerateShareCodePage', () => {
  let component: GenerateShareCodePage;
  let fixture: ComponentFixture<GenerateShareCodePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GenerateShareCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
