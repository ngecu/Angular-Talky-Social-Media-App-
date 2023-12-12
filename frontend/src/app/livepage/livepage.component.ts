import { Component } from '@angular/core';

@Component({
  selector: 'app-livepage',
  templateUrl: './livepage.component.html',
  styleUrls: ['./livepage.component.scss']
})
export class LivepageComponent {

   showSpinners: boolean = true;

  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);
  }
  
}
