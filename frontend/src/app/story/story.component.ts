import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent {
  stories:any[]= []
  constructor(private router: Router,private toastr: ToastrService,private postService:PostService) {
    this.getAllStories()
  }

  
  getAllStories() {
    this.postService.allPosts().subscribe(
      (response) => {
        this.stories = response.posts.filter(post => post.postType === "Status");

        console.log(this.stories," stories ");
        
      },
      (error) => {
        console.error("Error fetching stories:", error);
      }
    );
  }
  
}
