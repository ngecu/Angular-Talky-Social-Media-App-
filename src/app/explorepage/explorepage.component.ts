import { Component } from '@angular/core';

@Component({
  selector: 'app-explorepage',
  templateUrl: './explorepage.component.html',
  styleUrls: ['./explorepage.component.scss']
})
export class ExplorepageComponent {
  showSpinners: boolean = true;

  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);
  }
}
