import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellListComponent } from './buy-sell-list.component';

describe('BuySellListComponent', () => {
  let component: BuySellListComponent;
  let fixture: ComponentFixture<BuySellListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySellListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
