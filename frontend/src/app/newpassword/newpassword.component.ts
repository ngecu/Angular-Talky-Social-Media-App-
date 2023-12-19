import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.scss']
})
export class NewpasswordComponent {

  constructor(private router:Router,private fb:FormBuilder,private route:Router,private toastr: ToastrService){}

  //form group for validation
  newpwdForm=this.fb.group({
    password:['',[Validators.required]],
  })

  //login code
 
  resetPwd(){
    
    if(this.newpwdForm.valid){
      this.toastr.success('Token sent successfully to your email!', 'Success');

    }else{
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');     
      console.log(this.newpwdForm.value);
        
      
    }
  }


}
