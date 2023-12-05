import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorepageComponent } from './explorepage/explorepage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';

const routes: Routes = [
  {path:'',component:HomepageComponent},
  {path:'login',component:LoginpageComponent},
  {path:'explore',component:ExplorepageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
