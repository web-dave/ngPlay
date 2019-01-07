import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KarpatenhundComponent } from './karpatenhund.component';

describe('KarpatenhundComponent', () => {
  let component: KarpatenhundComponent;
  let fixture: ComponentFixture<KarpatenhundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KarpatenhundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KarpatenhundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
