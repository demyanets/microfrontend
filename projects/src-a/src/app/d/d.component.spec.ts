/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DComponent } from './d.component';

describe('DComponent', () => {
  let component: DComponent;
  let fixture: ComponentFixture<DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
