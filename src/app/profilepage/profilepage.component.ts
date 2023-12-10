import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent {

  showSpinners: boolean = true;
  images: any[] = [];

  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);
  }

  




  
}
