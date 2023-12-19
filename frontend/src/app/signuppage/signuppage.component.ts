import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDetails } from '../interfaces/user';
import {AuthService} from '../services/auth.service'
import { CloudinaryuploadService } from '../services/cloudinaryupload.service';

interface FileWithUrl {
  file: File;
  url: string;
  type:string;
  name:string;
}

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.scss']
})
export class SignuppageComponent {

  files: any[] = [];
  registrationForm!: FormGroup;

  constructor(private router:Router,private formBuilder: FormBuilder,private toastr: ToastrService,private authService:AuthService,private upload:CloudinaryuploadService) {
    this.registrationForm = this.formBuilder.group({
      profileImage: [null], // You might want to add custom validation for the profile image
      phone_no: ['', Validators.required,Validators.minLength(10)],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }


  createUser(){
    console.log(this.registrationForm.value);
    


    if (this.registrationForm.valid) {

      if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword  ) {
        this.toastr.error('Password Missmatch', 'Error');

      }
     
      if (this.files.length > 0) {
        for (let index = 0; index < this.files.length; index++) {
          const data = new FormData();
          const file_data = this.files[index];
          data.append('file', file_data);
          data.append('upload_preset', 'f3gqwyzn');
          data.append('cloud_name', 'dqquyjsap');
          
          this.upload.uploadImage(data).subscribe((res) => {
            console.log(res.secure_url);
            this.registrationForm.value.profileImage = res.secure_url;
            let details: UserDetails = this.registrationForm.value;
      
            this.authService.createUser(details).subscribe(
              (response) => {
                console.log(response);
                this.toastr.success('Form submitted successfully! Redirecting to login', 'Success');
                console.log('Form submitted successfully, redirect to login!', details);
      
                setTimeout(async () => {
                  this.router.navigate(['/login']);
                }, 2000);
              },
              (error) => {
                // Handle error
                this.toastr.error(`${error}`, 'Error');
                console.error('Error submitting form:', error);
              }
            );
          });
        }
      } else {
        // No files to upload, proceed with user creation without a profile image
        this.registrationForm.value.profileImage = ""
        let details: UserDetails = this.registrationForm.value;
      
        this.authService.createUser(details).subscribe(
          (response) => {
            console.log(response);
            this.toastr.success(response.message, 'Success');
            console.log('Form submitted successfully, redirect to login!', details);
      
            setTimeout(async () => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error) => {
            // Handle error
            this.toastr.error(`${error}`, 'Error');
            console.error('Error submitting form:', error);
          }
        );
      }
      

    } else {
      // Your form is invalid, display error messages or take appropriate action
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');
      console.log('Form is invalid. Please check the fields.',this.registrationForm.value);
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
