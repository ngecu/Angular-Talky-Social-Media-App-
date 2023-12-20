import { Component } from '@angular/core';
import 'boxicons'
import { Post } from '../interfaces/post';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../services/post.service';
import { Comment } from '../interfaces/comment';
import { PostDetails } from '../interfaces/post';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudinaryuploadService } from '../services/cloudinaryupload.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  public openPopup: Function | undefined;
  textArea: string = '';
  textArea2: string = '';
  posts:any[] = []
  textAreaVisible: boolean = false;
  loggedInuser = ""
  user_id = ""
  editingCommentIndex!: number 
  files: any[] = [];
  postFiles: any[] = [];
postForm!: FormGroup;
  editPostForm !: FormGroup;
  editpostFiles: any[] =[];

  postComment(post: Post) {
    if (post.comment) {
      console.log(post);
      
      // Assuming you have a service to handle posting comments
      this.postService.createComment(post,this.user_id).subscribe(
        (response) => {
          console.log(response);
          post.comment = '';
          this.getAllPosts()
          this.toastr.success('Comment added', 'Success');

        },
        (error) => {
          console.error('Error posting comment:', error);
          // Handle error as needed
        }
      );
    }
  }

 

  isLoggedInUser(username:string){
    if(username == this.loggedInuser) console.log("khkj");
     return 
  }

  getAllPosts() {
    this.postService.allPosts().subscribe(
      (response) => {
        console.log("response is ", response.posts);
  
        // Filter posts of type 'post'
        const filteredPosts = response.posts.filter(post => post.postType == "post");
  
        // Sort posts by created_at in descending order
        this.posts = filteredPosts.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });
  
        // Check if each post is liked by the user
        this.posts.forEach(post => {
          post.liked = post.likes.some((like: any) => like.reaction_user_id === this.user_id);
          
          // Calculate how many days ago the post was created
          const createdDate = new Date(post.created_at);
          const currentDate = new Date();
          const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime());
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          post.daysAgo = daysDiff;
        });
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );
  }
  
  
  
  replyToUsername: string = '';
  replyToCommentId:string = ''
  replyToComment(post:Post,entry: Comment,reply:boolean) {
    if(reply){
      this.replyToUsername = `@${entry.comment_creator_username}`;
      this.replyToCommentId = entry.comment_id
    }
    else{
      this.replyToUsername = `${entry.comment}`;

    }
  }

  sendCommentOnComment(post:Post,reply:boolean) {
    this.postService.commentOnComment(post,this.replyToCommentId,this.user_id,this.replyToUsername).subscribe(
      (response) => {
        console.log(response);
        this.replyToUsername = ""
        this.getAllPosts()
        this.toastr.success('Comment added', 'Success');
        window.location.reload()
      },
      (error) => {
        console.error('Error posting comment:', error);
        // Handle error as needed
      }
    );
  }
  

  editTextArea(entry: Post, index: number) {
    // Set the comment text to the post being edited
    entry.comment = entry.comment;
    // Set the editingCommentIndex to indicate that you are in edit mode
    this.editingCommentIndex = index;
  }

  setPopupAction(fn: any) {
      this.openPopup = fn;
  }



  onEnterFunction(){

    console.log("ghf")
  }

  isEmojiPickerVisible: boolean | undefined;
  public addEmoji(event: { emoji: { native: any; }; }) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }



  toggleLike(post: Post): void {
    // post.isLiked = !post.isLiked;
    // post.likes += post.isLiked ? 1 : -1;

    

    this.postService.toggleLikePost(post.post_id,this.user_id).subscribe(
      (response) => {
        console.log(response);
        post.comment = '';
        this.getAllPosts()
        this.toastr.success(`${response}`, 'Success');

      },
      (error) => {
        console.error('Error posting comment:', error);
        // Handle error as needed
      }
    );


  }


  deletePost(post: Post): void {
    // post.isBookmarked = !post.isBookmarked;
    if (confirm('Are you sure you want to delete this post?')) {
      // User clicked OK, proceed with deletion
      this.postService.deletePost(post.post_id).subscribe(
        (response) => {
          console.log(response);
          post.comment = '';
          this.getAllPosts();
          this.toastr.success(`${response}`, 'Success');
        },
        (error) => {
          console.error('Error deleting post:', error);
          // Handle error as needed
        }
      );
    }


  }



  deleteEntry(comment_id: string, index: number) {
    // Implement your delete logic here
    console.log("delete");
    this.postService.deleteComment(comment_id).subscribe(
      (response) => {
        console.log(response);
  
        // Remove the deleted comment from the array
        this.posts[index].comments.splice(index, 1);
        this.toastr.success('Comment deleted', 'Success');

      },
      (error) => {
        console.error(error, error);
        // Handle error as needed
      }
    );
  }
  

  constructor(private upload:CloudinaryuploadService,private formBuilder: FormBuilder,private router: Router,private toastr: ToastrService,private postService:PostService) {
    
    this.postForm = this.formBuilder.group({
      postImage: [],
      postType: 'Post', // Set default value
      caption: '',
    });

    this.editPostForm = this.formBuilder.group({
      postImage: [],
      postType: 'Post', // Set default value
      caption: '',
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.searchUsers();
    });
    this.getAllPosts()

    const storedUser = localStorage.getItem('user_details');
    if(storedUser){
      const user = JSON.parse(storedUser);
      this.loggedInuser = user.username
      this.user_id = user.user_id

    }
  }


  searchQuery: string = '';
  searchResults: User[] = [];
  users: User[] = [
    { username: 'instagram', isFollowing: false, profileImage: 'assets/images/profiles/profile-3.jpg' },
    { username: 'dccomics', isFollowing: false, profileImage: 'assets/images/profiles/profile-4.png' },
    { username: 'thecw', isFollowing: false, profileImage: 'assets/images/profiles/profile-5.jpg' }
  ];

  private searchSubject = new Subject<string>();



  searchUsers(): void {
    this.searchResults = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  isVideo(url: string): boolean {
    // Add your logic to determine if the URL is a video
    // For simplicity, let's assume that the URL ending with ".mp4" is a video
    return url.toLowerCase().endsWith('.mp4');
  }

  


  sharePost() {
    // Your logic to share the post
    console.log(this.postForm.value);
  
    if (this.postForm.valid) {
      const imageUrls: string[] = [];
    if(this.postFiles.length > 0 ){
   // Upload all images
   for (let index = 0; index < this.postFiles.length; index++) {
    const data = new FormData();
    const file_data = this.postFiles[index];
    data.append('file', file_data);
    data.append('upload_preset', 'f3gqwyzn');
    data.append('cloud_name', 'dqquyjsap');

    this.upload.uploadImage(data).subscribe((res) => {
      console.log(res.secure_url);
      imageUrls.push(res.secure_url);

      // If all images are uploaded, proceed to createPost
      if (imageUrls.length === this.postFiles.length) {
        // Set the array of image URLs in the form
        this.postForm.value.postImage = imageUrls ;

        // Create the post
        let details: PostDetails = this.postForm.value;
        details.created_by_user_id = this.user_id;

        this.postService.createPost(details).subscribe(
          (response) => {
            console.log(response.post);
            this.toastr.success('Post added successfully!', 'Success');
         
            // Clear the form or take other actions as needed
            this.postForm.reset();
            this.postFiles = []; // Clear the array of uploaded files

              this.getAllPosts()

          },
          (error) => {
            // Handle error
            this.toastr.error(`${error}`, 'Error');
            console.error('Error submitting form:', error);
          }
        );
      }
    });
  }
    }
    else{

              let details: PostDetails = this.postForm.value;
              details.created_by_user_id = this.user_id;
       this.postForm.value.postImage = [] ;
              this.postService.createPost(details).subscribe(
                (response) => {
                  console.log(response);
                  this.toastr.success('Form submitted successfully!', 'Success');
      
                  // Clear the form or take other actions as needed
                  this.postForm.reset();
                  this.postFiles = []; // Clear the array of uploaded files
                  this.getAllPosts()
                },
                (error) => {
                  // Handle error
                  this.toastr.error(`${error}`, 'Error');
                  console.error('Error submitting form:', error);
                }
              );
    }
   
    }
    

    else {
      // Your form is invalid, display error messages or take appropriate action
      this.toastr.error('Form is invalid. Please check the fields.', 'Error');
      console.log('Form is invalid. Please check the fields.');
    }

    

  }
  
  editPost(post_id:string) {
    // Your logic to share the post
    console.log(this.editPostForm.value);
  
  //   if (this.editPostForm.valid) {
  //     const imageUrls: string[] = [];
  //   if(this.editpostFiles.length > 0 ){
  //  // Upload all images
  //  for (let index = 0; index < this.editpostFiles.length; index++) {
  //   const data = new FormData();
  //   const file_data = this.postFiles[index];
  //   data.append('file', file_data);
  //   data.append('upload_preset', 'f3gqwyzn');
  //   data.append('cloud_name', 'dqquyjsap');

  //   this.upload.uploadImage(data).subscribe((res) => {
  //     console.log(res.secure_url);
  //     imageUrls.push(res.secure_url);

  //     // If all images are uploaded, proceed to createPost
  //     if (imageUrls.length === this.postFiles.length) {
  //       // Set the array of image URLs in the form
  //       this.postForm.value.postImage = imageUrls ;

  //       // Create the post
  //       let details: PostDetails = this.postForm.value;
  //       details.created_by_user_id = this.user_id;

  //       this.postService.editPost(details).subscribe(
  //         (response) => {
  //           console.log(response.post);
  //           this.toastr.success('Post updated successfully!', 'Success');
         
  //           // Clear the form or take other actions as needed
  //           this.postForm.reset();
  //           this.postFiles = []; // Clear the array of uploaded files
  //           this.getAllPosts()
  //         },
  //         (error) => {
  //           // Handle error
  //           this.toastr.error(`${error}`, 'Error');
  //           console.error('Error submitting form:', error);
  //         }
  //       );
  //     }
  //   });
  // }
  //   }
  //   else{

  //             let details: PostDetails = this.postForm.value;
  //             details.created_by_user_id = this.user_id;
  //      this.postForm.value.postImage = [] ;
  //             this.postService.createPost(details).subscribe(
  //               (response) => {
  //                 console.log(response);
  //                 this.toastr.success('Form submitted successfully!', 'Success');
      
  //                 // Clear the form or take other actions as needed
  //                 this.postForm.reset();
  //                 this.postFiles = []; // Clear the array of uploaded files
  //                 this.getAllPosts()
  //               },
  //               (error) => {
  //                 // Handle error
  //                 this.toastr.error(`${error}`, 'Error');
  //                 console.error('Error submitting form:', error);
  //               }
  //             );
  //   }
   
  //   }
    

  //   else {
  //     // Your form is invalid, display error messages or take appropriate action
  //     this.toastr.error('Form is invalid. Please check the fields.', 'Error');
  //     console.log('Form is invalid. Please check the fields.');
  //   }

    

  }

  onSelectPostImage(event: any) {
    console.log(event);
    this.postFiles.push(...event.addedFiles);
  }

  onRemovePostImage(event: any) {
    console.log(event);
    this.postFiles.splice(this.postFiles.indexOf(event), 1);
  }

  onSelectEditPostImage(event: any) {
    console.log(event);
    this.editpostFiles.push(...event.addedFiles);
  }

  onRemoveEditPostImage(event: any) {
    console.log(event);
    this.editpostFiles.splice(this.editpostFiles.indexOf(event), 1);
  }

  
}