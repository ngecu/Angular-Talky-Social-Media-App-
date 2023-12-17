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
      this.my_user_id = user.user_id
      this.profileImage = user.profileImage
    } else {
      console.error('User details not found in local storage');
    }
  }
  users: any[] = [];
  my_user_id = "";

  
  
  ngOnInit() {
    this.userService.getSuggestions().subscribe(
      (allUsersResponse) => {
        this.users = allUsersResponse
        console.log(allUsersResponse);
  
    
      },
      (allUsersError) => {
        this.toastr.error(`${allUsersError}`, 'Error');
        console.error('Error getting all users:', allUsersError);
      }
    );
  }
  

  toggleFollow(user: UserDetails): void {
    if(user.user_id){
      const body = {
        following_user_id:this.my_user_id,
         followed_user_id:user.user_id
      }
  
  console.log(body);
  
      this.userService.toggleFollowUser(body).subscribe(
        (response) => {
          console.log(response);
          this.userService.getSuggestions().subscribe(
            (allUsersResponse) => {
              this.users = allUsersResponse
            })
          
        }
      )
    }
   
  }

}
