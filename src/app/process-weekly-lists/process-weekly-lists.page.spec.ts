import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessWeeklyListsPage } from './process-weekly-lists.page';

describe('ProcessWeeklyListsPage', () => {
  let component: ProcessWeeklyListsPage;
  let fixture: ComponentFixture<ProcessWeeklyListsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProcessWeeklyListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
