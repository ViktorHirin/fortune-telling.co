import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerStaticPageComponent } from './manager-static-page.component';

describe('ManagerStaticPageComponent', () => {
  let component: ManagerStaticPageComponent;
  let fixture: ComponentFixture<ManagerStaticPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerStaticPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerStaticPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
