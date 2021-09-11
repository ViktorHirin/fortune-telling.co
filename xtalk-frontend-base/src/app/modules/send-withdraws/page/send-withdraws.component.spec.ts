import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendWithdrawsComponent } from './send-withdraws.component';

describe('SendWithdrawsComponent', () => {
  let component: SendWithdrawsComponent;
  let fixture: ComponentFixture<SendWithdrawsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendWithdrawsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendWithdrawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
