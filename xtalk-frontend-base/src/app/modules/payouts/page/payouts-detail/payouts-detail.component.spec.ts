import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutsDetailComponent } from './payouts-detail.component';

describe('PayoutsDetailComponent', () => {
  let component: PayoutsDetailComponent;
  let fixture: ComponentFixture<PayoutsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
