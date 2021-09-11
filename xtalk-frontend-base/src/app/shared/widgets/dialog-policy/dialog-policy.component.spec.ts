import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPolicyComponent } from './dialog-policy.component';

describe('DialogPolicyComponent', () => {
  let component: DialogPolicyComponent;
  let fixture: ComponentFixture<DialogPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
