import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FollowingComponent } from './following/following.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { PostComponent } from './post/post.component';
import { StoryComponent } from './story/story.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { ExplorepageComponent } from './explorepage/explorepage.component';
import { MessagespageComponent } from './messagespage/messagespage.component';
import {WebcamModule} from 'ngx-webcam';
import { LivepageComponent } from './livepage/livepage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ForgetpwdComponent } from './forgetpwd/forgetpwd.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    FollowingComponent,
    SuggestionsComponent,
    PostComponent,
    StoryComponent,
    SidebarComponent,
    LoginpageComponent,
    ExplorepageComponent,
    MessagespageComponent,
    LivepageComponent,
    ProfilepageComponent,
    SignuppageComponent,
    ForgetpwdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PickerModule,
    FormsModule,
    WebcamModule,
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
