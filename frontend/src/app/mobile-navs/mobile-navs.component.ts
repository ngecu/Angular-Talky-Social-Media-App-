import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { User } from '../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CloudinaryuploadService } from '../services/cloudinaryupload.service';
import { PostDetails } from '../interfaces/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-mobile-navs',
  templateUrl: './mobile-navs.component.html',
  styleUrls: ['./mobile-navs.component.scss']
})
export class MobileNavsComponent {

  registrationForm!: FormGroup;
  files: any[] = [];
  postFiles: any[] = [];
postForm!: FormGroup;

  public isLightTheme = true;
  textArea: string = '';
  textArea2: string = '';
  isEmojiPickerVisible: boolean | undefined;


  onThemeSwitchChange() {
    this.isLightTheme = !this.isLightTheme;

    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }
  
  constructor(private router: Router,private toastr: ToastrService,private formBuilder: FormBuilder,private upload:CloudinaryuploadService,private postService:PostService) {
    this.postForm = this.formBuilder.group({
      postImage: [],
      postType: 'Post', // Set default value
      caption: '',
    });


    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.searchUsers();
    });
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }



  searchQuery: string = '';
  searchResults: User[] = [];
  users: User[] = [
    { username: 'instagram', isFollowing: false, profileImage: 'assets/images/profiles/profile-3.jpg' },
    { username: 'dccomics', isFollowing: false, profileImage: 'assets/images/profiles/profile-4.png' },
    { username: 'thecw', isFollowing: false, profileImage: 'assets/images/profiles/profile-5.jpg' }
  ];

  private searchSubject = new Subject<string>();



  searchUsers(): void {
    this.searchResults = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  Logout(){
    this.router.navigate(['login']);
    localStorage.clear();
    this.toastr.success('Form submitted successfully! Redirecting to login', 'Success');

  }

  sharePost() {
    // Your logic to share the post
    console.log(this.postForm.value);
  
    if (this.postForm.valid) {
      const imageUrls: string[] = [];
    
      // Upload all images
      for (let index = 0; index < this.postFiles.length; index++) {
        const data = new FormData();
        const file_data = this.postFiles[index];
        data.append('file', file_data);
        data.append('upload_preset', 'f3gqwyzn');
        data.append('cloud_name', 'dqquyjsap');
    
        this.upload.uploadImage(data).subscribe((res) => {
          console.log(res.secure_url);
          imageUrls.push(res.secure_url);
    
          // If all images are uploaded, proceed to createPost
          if (imageUrls.length === this.postFiles.length) {
            // Set the array of image URLs in the form
            this.postForm.value.postImage = imageUrls ;
    
            // Create the post
            let details: PostDetails = this.postForm.value;
            details.created_at = new Date().toISOString();
            details.created_by_user_id = "Robin";

            this.postService.createPost(details).subscribe(
              (response) => {
                console.log(response);
                this.toastr.success('Form submitted successfully!', 'Success');
    
                // Clear the form or take other actions as needed
                this.postForm.reset();
                this.postFiles = []; // Clear the array of uploaded files
    
              },
              (error) => {
                // Handle error
                this.toastr.error(`${error}`, 'Error');
                console.error('Error submitting form:', error);
              }
            );
          }
        });
      }
    }
    

    else {
      // Your form is invalid, display error messages or take appropriate action
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');
      console.log('Form is invalid. Please check the fields.',this.registrationForm.value);
    }

    

  }
  
  onSelectPostImage(event: any) {
    console.log(event);
    this.postFiles.push(...event.addedFiles);
  }

  onRemovePostImage(event: any) {
    console.log(event);
    this.postFiles.splice(this.postFiles.indexOf(event), 1);
  }

  public addEmoji(event: { emoji: { native: any; }; }) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

}
