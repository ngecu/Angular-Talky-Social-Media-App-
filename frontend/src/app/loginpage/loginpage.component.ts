import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { userLogin } from '../interfaces/login';


@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent {


  notFoundMessage:String=''
  isLoggined:boolean=false
  loginForm !:FormGroup

  constructor(private router:Router,private fb:FormBuilder,private route:Router,private toastr: ToastrService,private authService:AuthService){
      //form group for validation
  this.loginForm=this.fb.group({
    Email:['',[Validators.required]],
    Password:['',[Validators.required]],
  })
  }



  //login code
 
  login(){
    
    if(this.loginForm.valid){
      let details: userLogin = this.loginForm.value

      this.authService.loginUser(details).subscribe(
        (response) => {
          
          this.authService.checkDetails().subscribe(
            (response) => {
          console.log(response);

              localStorage.setItem('user_details', JSON.stringify(response.info));
            }
          )
          this.toastr.success(`${response.message}`, 'Success');
  
          setTimeout( async() => {             
            this.router.navigate(['/'])
          }, 2000);
  

        },
        (error) => {
          // Handle error
          this.toastr.error(`${error}`, 'Error');

          console.error('Error submitting form:', error);
        }
      );
      

    }else{
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');     
      console.log(this.loginForm.value);
        
      
    }
  }
}
