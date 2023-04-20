import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassDialogComponent } from './reset-pass-dialog.component';

describe('ResetPassDialogComponent', () => {
  let component: ResetPassDialogComponent;
  let fixture: ComponentFixture<ResetPassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPassDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
