import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTiersComponent } from './my-tiers.component';

describe('MyTiersComponent', () => {
  let component: MyTiersComponent;
  let fixture: ComponentFixture<MyTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
