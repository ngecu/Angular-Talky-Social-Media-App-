import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent {


  notFoundMessage:String=''
  isLoggined:boolean=false

  constructor(private fb:FormBuilder,private route:Router){}

  //form group for validation
  loginForm=this.fb.group({
    Email:['',[Validators.required,Validators.email]],
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
        setTimeout(() => {
          this.route.navigateByUrl(``)
        },2000);
      }
      else{
        this.notFoundMessage="Can't login incorrect Email or Password"
        setTimeout(() => {
          this.loginForm.reset()
          this.notFoundMessage=''
          
        }, 2000);
      }

    }else{
      this.notFoundMessage='Invalid Details'
      setTimeout(() => {
        this.loginForm.reset()
        this.notFoundMessage=''
        
      }, 2000);
       

      
      
    }
  }
}
