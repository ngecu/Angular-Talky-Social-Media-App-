import { Component } from '@angular/core';

@Component({
  selector: 'app-messagespage',
  templateUrl: './messagespage.component.html',
  styleUrls: ['./messagespage.component.scss']
})
export class MessagespageComponent {
  showSpinners: boolean = true;

  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);
  }
  
}
