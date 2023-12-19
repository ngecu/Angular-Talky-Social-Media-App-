import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorepageComponent } from './explorepage/explorepage.component';
import { ForgetpwdComponent } from './forgetpwd/forgetpwd.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LivepageComponent } from './livepage/livepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MessagespageComponent } from './messagespage/messagespage.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { PostpageComponent } from './postpage/postpage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';

const routes: Routes = [
  {path:'',component:HomepageComponent},
  {path:'login',component:LoginpageComponent},
  {path:'explore',component:ExplorepageComponent},
  {path:'direct/inbox',component:MessagespageComponent},
  {path:'live',component:LivepageComponent},
  {path:'profile/:username',component:ProfilepageComponent},
  {path:'post/:post_id',component:PostpageComponent},
  {path:'new-password/:user_id/:token',component:NewpasswordComponent},

  {path:'signup',component:SignuppageComponent},
  {path:'forgotpwd',component:ForgetpwdComponent},





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
