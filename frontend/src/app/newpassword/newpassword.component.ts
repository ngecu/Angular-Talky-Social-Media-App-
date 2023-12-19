import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.scss']
})
export class NewpasswordComponent {
  user_id_param:string = ""
  constructor(private router:Router,private fb:FormBuilder,private route:ActivatedRoute,private toastr: ToastrService,private userService:UserService){
    this.route.params.subscribe(params => {
      const user_id = params['user_id'] as string
  
      if (user_id) {
        console.log("user_id id is ",user_id);
        this.user_id_param = user_id
    
      }
  })
  }

  //form group for validation
  newpwdForm=this.fb.group({
    password:['',[Validators.required]],
  })

  //login code
 
  resetPwd(){
    
    if(this.newpwdForm.valid){
      const pwd = this.newpwdForm.value.password as string
      console.log(this.newpwdForm.value);
      this.userService.resetPwd( this.user_id_param,pwd).subscribe(
        (response) => {
          console.log(response);
          
          this.toastr.success(response.message, 'Success');

        }
      )
      }


    else{
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');     
      console.log(this.newpwdForm.value);
        
      
    }
  }


}
