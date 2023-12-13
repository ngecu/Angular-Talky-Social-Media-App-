import { Component } from '@angular/core';
import { User, UserDetails } from '../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {
  storedUser: string | null = localStorage.getItem('user_details');
  username : string = ""
  fullName : string = ""
  profileImage:string = ""

  constructor(private route:Router,private toastr: ToastrService,private userService:UserService){
    if (this.storedUser) {
      const user = JSON.parse(this.storedUser);
      this.username = user.username
      this.fullName = user.fullName
      this.profileImage = user.profileImage
    } else {
      console.error('User details not found in local storage');
    }
  }
  users: UserDetails[] = [];
  my_user_id = "";

  
  
  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      (allUsersResponse) => {
        console.log(allUsersResponse);
  
        // Get followers for the current user
        this.userService.getFollowers(this.my_user_id).subscribe(
          (followersResponse) => {
            console.log(followersResponse);
  
            // Extract follower IDs
            const followerIds = followersResponse.map(follower => follower.user_id);
  
            // Filter out users who are followers
            this.users = allUsersResponse.filter(user => !followerIds.includes(user.user_id));
          },
          (followersError) => {
            this.toastr.error(`${followersError}`, 'Error');
            console.error('Error getting followers:', followersError);
          }
        );
      },
      (allUsersError) => {
        this.toastr.error(`${allUsersError}`, 'Error');
        console.error('Error getting all users:', allUsersError);
      }
    );
  }
  

  toggleFollow(user: UserDetails): void {
 
  }

}
