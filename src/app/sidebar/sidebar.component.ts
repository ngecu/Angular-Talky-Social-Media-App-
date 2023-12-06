import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Popover} from 'bootstrap'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private router: Router) {

  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }


  
}
