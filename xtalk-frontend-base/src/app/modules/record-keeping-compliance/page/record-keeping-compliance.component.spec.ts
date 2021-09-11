import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordKeepingComplianceComponent } from './record-keeping-compliance.component';

describe('RecordKeepingComplianceComponent', () => {
  let component: RecordKeepingComplianceComponent;
  let fixture: ComponentFixture<RecordKeepingComplianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordKeepingComplianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordKeepingComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
