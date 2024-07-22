import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActaConstitutivaModalComponent } from './acta-constitutiva-modal.component';

describe('ActaConstitutivaModalComponent', () => {
  let component: ActaConstitutivaModalComponent;
  let fixture: ComponentFixture<ActaConstitutivaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActaConstitutivaModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActaConstitutivaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
