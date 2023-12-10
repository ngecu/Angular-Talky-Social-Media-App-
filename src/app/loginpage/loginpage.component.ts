import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent {


  notFoundMessage:String=''
  isLoggined:boolean=false

  constructor(private router:Router,private fb:FormBuilder,private route:Router,private toastr: ToastrService){}

  //form group for validation
  loginForm=this.fb.group({
    Email:['',[Validators.required]],
    Password:['',[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z/d$@$!%*?&].{8,}')]],
  })

  //login code
 
  login(){
    
    if(this.loginForm.valid){
      let Email=this.loginForm.value.Email
      let Password=this.loginForm.value.Password
      console.log(Email)
      if(Email == "admin"  && Password== "admin"){
        localStorage.setItem('isLoggined',`${true}`)
        
        this.isLoggined=true
        this.toastr.success('Form submitted successfully! Redirecting to login', 'Success');

        setTimeout(() => {
          this.router.navigate(['/'])

        },2000);
      }
      else{
        this.toastr.error('Incorrect Details', 'Error');
      }

    }else{
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');       
      
    }
  }
}
