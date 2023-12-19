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
  posts:any[] = []
  registrationForm!: FormGroup;
  files: any[] = [];
  postFiles: any[] = [];
postForm!: FormGroup;
html: string = `<h1>Heading h1</h1><h2>Heading h2</h2><h3>Heading h3</h3><h4>Heading h4</h4><h5>Heading h5</h5><h6>Heading h6</h6>`;

storedUser: string | null = localStorage.getItem('user_details');
user_id:string = ""



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
  


    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.searchUsers();
    });

    if (this.storedUser) {
      const user = JSON.parse(this.storedUser);
      this.user_id = user.user_id
    } else {
      console.error('User details not found in local storage');
    }

    
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

  getAllPosts() {
    this.postService.allPosts().subscribe(
      (response) => {
        console.log("response is ", response.posts);
  
        // Filter posts of type 'post'
        const filteredPosts = response.posts.filter(post => post.postType == "post");
  
        // Sort posts by created_at in descending order
        this.posts = filteredPosts.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );
  }


  public addEmoji(event: { emoji: { native: any; }; }) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

}
