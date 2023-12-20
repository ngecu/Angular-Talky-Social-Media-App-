import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Post } from '../interfaces/post';

   interface UserDetails {
    user_id?: string;
    profileImage?: string;
    fullName?: string;
    email?: string;
    username?: string;
    phone_no?: string;
    active?: number;
    created_at?: string;
  }


@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})


export class ProfilepageComponent {
  updateProfileForm!: FormGroup;
  user_id : string = ""
  showSpinners: boolean = true;
  images: any[] = [];
  files: any[] = ['assets/images/profiles/profile-2.jpg'];
  storedUser: string | null = localStorage.getItem('user_details');
  username : string = ""
  fullName : string = ""
  profileImage:string = ""
  posts:any[] = []

  userDetails:UserDetails = {}
  followers:any[] = []
  followings:any[] = []

  
  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);

    const storedUserDetails = localStorage.getItem('user_details');
    if (storedUserDetails) {
      // Parse the JSON string and assign it to the userDetails property
      this.userDetails = JSON.parse(storedUserDetails);

      this.userService.getFollowers(JSON.parse(storedUserDetails).user_id).subscribe(
        (response) => {
          console.log('Followers:', response);
          this.followers = response
          // Handle the response as needed
        },
        (error) => {
          console.error('Error fetching followers:', error);
          // Handle errors
        }
      );
    }
    
     // Check if the user is logged in
     const isLoggedIn = localStorage.getItem('isLoggined') === 'true';

     // If not logged in, redirect to the login page
     if (!isLoggedIn) {
       this.router.navigate(['/login']);
     }

  
    }

  
  updateUser(): void {
    // Make API call to update user details on the server
    // ...
  
    // Optionally, update local storage if needed
    localStorage.setItem('user_details', JSON.stringify(this.userDetails));
    this.userService.updateProfile(this.userDetails).subscribe(
      (response) => {
        // Handle success
        console.log('Profile updated successfully:', response);
        this.toastr.success(response.message, 'Success');
        window.location.reload()

        // You can optionally show a success message or perform other actions
      },
      (error) => {
        // Handle error
        console.error('Error updating profile:', error);
    
        this.toastr.error(error, 'Error');

    
        // You can show an error message or perform other error-related actions
      }
    );
    
  }

  prepopulatedData = {
    profileImage: 'path/to/image.jpg',
    mobile: '1234567890',
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  };

  constructor(private router:Router,private formBuilder: FormBuilder,private toastr: ToastrService,private route: ActivatedRoute,private postService:PostService,private userService:UserService) {
    if (this.storedUser) {
      const user = JSON.parse(this.storedUser);
      this.username = user.username
      this.fullName = user.fullName
      this.profileImage = user.profileImage
    } else {
      console.error('User details not found in local storage');
    }

    this.updateProfileForm = this.formBuilder.group({
      profileImage: [this.prepopulatedData.profileImage],
      mobile: [this.prepopulatedData.mobile, Validators.required],
      fullName: [this.prepopulatedData.fullName, Validators.required],
      username: [this.prepopulatedData.username, Validators.required],
      email: [this.prepopulatedData.email, [Validators.required, Validators.email]],
      password: [this.prepopulatedData.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.prepopulatedData.confirmPassword, Validators.required]
    });

   this.fetchUserPosts()
}




fetchUserPosts(){
  this.postService.userPosts().subscribe(
    (response)=>{
      this.posts = response.posts

      console.log(response);
      
    }
  )
}



  onSubmit() {
    this.updateProfileForm.value.profileImage = this.files
    if (this.updateProfileForm.valid) {

      if (this.updateProfileForm.value.password != this.updateProfileForm.value.confirmPassword  ) {
        this.toastr.error('Password Missmatch', 'Error');

      }
      if (this.updateProfileForm.value.mobile.length != 10) {
        this.toastr.error('Mobile Number should be 10 digits', 'Error');

      }
      else{
      this.toastr.success('Profile Details!', 'Success');
      console.log('Form submitted successfully,redirect to login!', this.updateProfileForm.value);

      setTimeout( async() => {     
      }, 2000);

      }

    } else {
      // Your form is invalid, display error messages or take appropriate action
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');
      console.log('Form is invalid. Please check the fields.',this.updateProfileForm.value);
    }
  }
  

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  toggleLike(post: Post): void {
    // post.isLiked = !post.isLiked;
    // post.likes += post.isLiked ? 1 : -1;

    

    this.postService.toggleLikePost(post.post_id,this.user_id).subscribe(
      (response) => {
        console.log(response);
        post.comment = '';
       
        this.toastr.success(`${response}`, 'Success');

      },
      (error) => {
        console.error('Error posting comment:', error);
        // Handle error as needed
      }
    );


  }
  
  deletePost(post: Post): void {
    // post.isBookmarked = !post.isBookmarked;
    if (confirm('Are you sure you want to delete this post?')) {
      // User clicked OK, proceed with deletion
      this.postService.deletePost(post.post_id).subscribe(
        (response) => {
          console.log(response);
          post.comment = '';
          
          this.toastr.success(`${response}`, 'Success');
        },
        (error) => {
          console.error('Error deleting post:', error);
          // Handle error as needed
        }
      );
    }


  }



  deleteEntry(comment_id: string, index: number) {
    // Implement your delete logic here
    console.log("delete");
    this.postService.deleteComment(comment_id).subscribe(
      (response) => {
        console.log(response);
  
        // Remove the deleted comment from the array
        this.posts[index].comments.splice(index, 1);
        this.toastr.success('Comment deleted', 'Success');

      },
      (error) => {
        console.error(error, error);
        // Handle error as needed
      }
    );
  }

  postComment(post: Post) {
    if (post.comment) {
      console.log(post);
      
      // Assuming you have a service to handle posting comments
      this.postService.createComment(post,this.user_id).subscribe(
        (response) => {
          console.log(response);
          post.comment = '';
      
          this.toastr.success('Comment added', 'Success');

        },
        (error) => {
          console.error('Error posting comment:', error);
          // Handle error as needed
        }
      );
    }
  }

}