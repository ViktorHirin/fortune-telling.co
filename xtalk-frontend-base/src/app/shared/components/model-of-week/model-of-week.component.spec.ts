import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelOfWeekComponent } from './model-of-week.component';

describe('ModelOfWeekComponent', () => {
  let component: ModelOfWeekComponent;
  let fixture: ComponentFixture<ModelOfWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelOfWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelOfWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
