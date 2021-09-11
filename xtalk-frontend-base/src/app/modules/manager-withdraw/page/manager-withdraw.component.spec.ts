import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerWithdrawComponent } from './manager-withdraw.component';

describe('ManagerWithdrawComponent', () => {
  let component: ManagerWithdrawComponent;
  let fixture: ComponentFixture<ManagerWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
