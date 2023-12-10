import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagespageComponent } from './messagespage.component';

describe('MessagespageComponent', () => {
  let component: MessagespageComponent;
  let fixture: ComponentFixture<MessagespageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagespageComponent]
    });
    fixture = TestBed.createComponent(MessagespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
