import {NgModule} from "@angular/core";
import {SelectModule} from 'ng2-select';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopComponent } from './desktop.component';
import { Component } from '@angular/core';

describe('', () => {
  let component: DesktopComponent;
  let fixture: ComponentFixture<DesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'desktop',
  template: ``
})
export class Desktop {

}