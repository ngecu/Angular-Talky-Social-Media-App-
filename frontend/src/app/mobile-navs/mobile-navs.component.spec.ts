import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavsComponent } from './mobile-navs.component';

describe('MobileNavsComponent', () => {
  let component: MobileNavsComponent;
  let fixture: ComponentFixture<MobileNavsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileNavsComponent]
    });
    fixture = TestBed.createComponent(MobileNavsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
