import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorepageComponent } from './explorepage/explorepage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LivepageComponent } from './livepage/livepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MessagespageComponent } from './messagespage/messagespage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';

const routes: Routes = [
  {path:'',component:HomepageComponent},
  {path:'login',component:LoginpageComponent},
  {path:'explore',component:ExplorepageComponent},
  {path:'direct/inbox',component:MessagespageComponent},
  {path:'live',component:LivepageComponent},
  {path:'devngecu',component:ProfilepageComponent},
  {path:'signup',component:SignuppageComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
