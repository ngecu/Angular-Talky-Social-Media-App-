import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  showSpinners: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);

    //  // Check if the user is logged in
    //  const isLoggedIn = localStorage.getItem('isLoggined') === 'true';

    //  // If not logged in, redirect to the login page
    //  if (!isLoggedIn) {
    //    this.router.navigate(['/login']);
    //  }

  }


 

 

}
