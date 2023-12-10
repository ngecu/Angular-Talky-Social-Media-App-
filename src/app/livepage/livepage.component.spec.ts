import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivepageComponent } from './livepage.component';

describe('LivepageComponent', () => {
  let component: LivepageComponent;
  let fixture: ComponentFixture<LivepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivepageComponent]
    });
    fixture = TestBed.createComponent(LivepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
