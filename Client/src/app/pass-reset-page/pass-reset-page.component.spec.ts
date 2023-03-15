import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassResetPageComponent } from './pass-reset-page.component';

describe('PassResetPageComponent', () => {
  let component: PassResetPageComponent;
  let fixture: ComponentFixture<PassResetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassResetPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassResetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
