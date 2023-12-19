import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { User } from '../interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  registrationForm!: FormGroup;
  files: any[] = [];
  username : string = ""

  public isLightTheme = true;

  onThemeSwitchChange() {
    this.isLightTheme = !this.isLightTheme;

    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }
  storedUser: string | null = localStorage.getItem('user_details');

  constructor(private authService:AuthService,private router: Router,private toastr: ToastrService,private formBuilder: FormBuilder,) {

    if (this.storedUser) {
      const user = JSON.parse(this.storedUser);
      this.username = user.username
    } else {
      console.error('User details not found in local storage');
    }

    this.registrationForm = this.formBuilder.group({
      mobile: ['', Validators.required],
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

  Deactivate(){
    
    if(confirm("Are you sure you want to deactivate this account")){
      this.authService.deactivateAccount().subscribe(
        (response) => {
          console.log(response);
          this.toastr.success('Successfully Deactivated Account', 'Success');

          this.router.navigate(['login']);
          localStorage.clear();
        },
        (error) => {
          // Handle error
          this.toastr.error(`${error.error.error}`, 'Error');

          console.error('Error submitting form:', error);
        }
      )
      

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

  onSubmit() {
    this.registrationForm.value.profileImage = this.files
    if (this.registrationForm.valid) {

      if (confirm(`Are you sure you want to Post this content??`)) {
        this.toastr.success('Post Added Successfully! Redirecting to login', 'Success');


      }


      }

    else {
      // Your form is invalid, display error messages or take appropriate action
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');
      console.log('Form is invalid. Please check the fields.',this.registrationForm.value);
    }
  }
}
