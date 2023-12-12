import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);
  }

  galleryItems = [
    'https://wallpapers.com/images/hd/beautiful-black-woman-with-the-sky-wrcmewxu2vjopsav.jpg',
    'https://c1.wallpaperflare.com/preview/432/737/233/beautiful-african-woman.jpg',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
    'https://wallpapers.com/images/hd/1920x1080-hd-car-bvswz2skd2mquyjc.jpg',
    'https://wallpapers.com/images/hd/beautiful-black-woman-with-the-sky-wrcmewxu2vjopsav.jpg',
    'https://c1.wallpaperflare.com/preview/432/737/233/beautiful-african-woman.jpg',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
    'https://wallpapers.com/images/hd/1920x1080-hd-car-bvswz2skd2mquyjc.jpg',
    'https://wallpapers.com/images/hd/beautiful-black-woman-with-the-sky-wrcmewxu2vjopsav.jpg',
    'https://c1.wallpaperflare.com/preview/432/737/233/beautiful-african-woman.jpg',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
    'https://wallpapers.com/images/hd/1920x1080-hd-car-bvswz2skd2mquyjc.jpg',
    'https://wallpapers.com/images/hd/beautiful-black-woman-with-the-sky-wrcmewxu2vjopsav.jpg',
    'https://c1.wallpaperflare.com/preview/432/737/233/beautiful-african-woman.jpg',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
    'https://wallpapers.com/images/hd/1920x1080-hd-car-bvswz2skd2mquyjc.jpg',
    'https://wallpapers.com/images/hd/beautiful-black-woman-with-the-sky-wrcmewxu2vjopsav.jpg',
    'https://c1.wallpaperflare.com/preview/432/737/233/beautiful-african-woman.jpg',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
    'https://wallpapers.com/images/hd/1920x1080-hd-car-bvswz2skd2mquyjc.jpg'
    // Add more image URLs as needed
  ];
  

  prepopulatedData = {
    profileImage: 'path/to/image.jpg',
    mobile: '1234567890',
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  };

  constructor(private router:Router,private formBuilder: FormBuilder,private toastr: ToastrService,private route: ActivatedRoute) {
    
    this.updateProfileForm = this.formBuilder.group({
      profileImage: [this.prepopulatedData.profileImage],
      mobile: [this.prepopulatedData.mobile, Validators.required],
      fullName: [this.prepopulatedData.fullName, Validators.required],
      username: [this.prepopulatedData.username, Validators.required],
      email: [this.prepopulatedData.email, [Validators.required, Validators.email]],
      password: [this.prepopulatedData.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.prepopulatedData.confirmPassword, Validators.required]
    });

    this.route.params.subscribe(params => {
      this.user_id=  params['username'] as string

     
  })
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
  
  

}