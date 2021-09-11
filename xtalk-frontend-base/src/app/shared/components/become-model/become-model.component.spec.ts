import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeModelComponent } from './become-model.component';

describe('BecomeModelComponent', () => {
  let component: BecomeModelComponent;
  let fixture: ComponentFixture<BecomeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
