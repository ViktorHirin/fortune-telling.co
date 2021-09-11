import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToCallComponent } from './how-to-call.component';

describe('HowToCallComponent', () => {
  let component: HowToCallComponent;
  let fixture: ComponentFixture<HowToCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
