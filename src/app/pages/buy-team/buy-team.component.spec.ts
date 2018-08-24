import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTeamComponent } from './buy-team.component';

describe('BuyTeamComponent', () => {
  let component: BuyTeamComponent;
  let fixture: ComponentFixture<BuyTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
