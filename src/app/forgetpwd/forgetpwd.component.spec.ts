import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpwdComponent } from './forgetpwd.component';

describe('ForgetpwdComponent', () => {
  let component: ForgetpwdComponent;
  let fixture: ComponentFixture<ForgetpwdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetpwdComponent]
    });
    fixture = TestBed.createComponent(ForgetpwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
