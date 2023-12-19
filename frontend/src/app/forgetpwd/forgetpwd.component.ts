import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgetpwd',
  templateUrl: './forgetpwd.component.html',
  styleUrls: ['./forgetpwd.component.scss']
})
export class ForgetpwdComponent {

  constructor(private router:Router,private fb:FormBuilder,private route:Router,private toastr: ToastrService,private userService:UserService){}

  //form group for validation
  fgtpwdForm=this.fb.group({
    email:['',[Validators.required]],
  })

  //login code
 
  sendToken(){
    if(this.fgtpwdForm.valid){
      const body = {
        email:this.fgtpwdForm.value.email
      }
  
      this.userService.sendResetToken(body).subscribe(
        (response) => {
          console.log("resposne is ",response);
          this.toastr.success('Token sent successfully to your email!', 'Success');
  
        },
        (error)=>{
          this.toastr.error(error, 'Error');     

        }
      )
    }
  
  }

}
