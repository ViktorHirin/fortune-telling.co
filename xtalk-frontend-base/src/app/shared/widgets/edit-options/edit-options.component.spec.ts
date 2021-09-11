import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOptionsComponent } from './edit-options.component';

describe('EditOptionsComponent', () => {
  let component: EditOptionsComponent;
  let fixture: ComponentFixture<EditOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
