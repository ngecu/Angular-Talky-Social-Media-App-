import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-postpage',
  templateUrl: './postpage.component.html',
  styleUrls: ['./postpage.component.scss']
})
export class PostpageComponent {
  post:any;
  showSpinners: boolean = true;

  constructor(private route: ActivatedRoute, private postService: PostService) { 
  this.route.params.subscribe(params => {
    const post_id = params['post_id'] as string

    if (post_id) {
      console.log("event id is ",post_id);
      
      this.getPostDetails(post_id);
    }
})
}

ngOnInit() {
  // Set a timeout to hide the spinners after 5 seconds
  setTimeout(() => {
    this.showSpinners = false;
  }, 3000);
}

   getPostDetails(post_id: string) {
    this.postService.singlePost(post_id).subscribe(
      (response) => {
        console.log(response);
  
        this.post = response

      },
      (error) => {
        console.error(error, error);
        // Handle error as needed
      }
    );
  }
}
