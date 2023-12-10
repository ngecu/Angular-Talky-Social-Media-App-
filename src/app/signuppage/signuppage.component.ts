import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private router:Router,private formBuilder: FormBuilder,private toastr: ToastrService) {
    this.registrationForm = this.formBuilder.group({
      profileImage: [null], // You might want to add custom validation for the profile image
      mobile: ['', Validators.required],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }


  
  onSubmit() {
    this.registrationForm.value.profileImage = this.files
    if (this.registrationForm.valid) {

      if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword  ) {
        this.toastr.error('Password Missmatch', 'Error');

      }
      if (this.registrationForm.value.mobile.length != 10) {
        this.toastr.error('Mobile Number should be 10 digits', 'Error');

      }
      else{
      this.toastr.success('Form submitted successfully! Redirecting to login', 'Success');
      console.log('Form submitted successfully,redirect to login!', this.registrationForm.value);

      setTimeout( async() => {     
  
      this.router.navigate(['/login'])
    }, 2000);

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
