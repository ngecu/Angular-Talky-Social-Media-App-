import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgetpwd',
  templateUrl: './forgetpwd.component.html',
  styleUrls: ['./forgetpwd.component.scss']
})
export class ForgetpwdComponent {

  constructor(private router:Router,private fb:FormBuilder,private route:Router,private toastr: ToastrService){}

  //form group for validation
  fgtpwdForm=this.fb.group({
    Email:['',[Validators.required]],
  })

  //login code
 
  sendToken(){
    
    if(this.fgtpwdForm.valid){
      this.toastr.success('Token sent successfully to your email!', 'Success');

    }else{
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');     
      console.log(this.fgtpwdForm.value);
        
      
    }
  }

}
