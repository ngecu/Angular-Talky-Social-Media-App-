import { Component } from '@angular/core';
import 'boxicons'
import { Post } from '../interfaces/post';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../services/post.service';


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
  // postComment(post: Post) {
  //   if (post.comment) {
  //     console.log(post);
      
  //     // Assuming you have a service to handle posting comments
  //     this.postService.createComment(post,this.user_id).subscribe(
  //       (response) => {
  //         console.log(response);
  //         post.comment = '';
  //         this.getAllPosts()
  //         this.toastr.success('Comment added', 'Success');

  //       },
  //       (error) => {
  //         console.error('Error posting comment:', error);
  //         // Handle error as needed
  //       }
  //     );
  //   }
  // }

  postComment(post: Post,comment_id:string) {
    if (this.editingCommentIndex !== null) {
      // You are in edit mode, handle update logic here
      const editedPost = { ...post }; // Create a copy to avoid modifying the original post
      editedPost.comment = post.comment; // Assuming commentText is the property where the edited comment is stored
      this.postService.updateComment(editedPost,comment_id).subscribe(
        (response) => {
          // Assuming the server returns the updated post
          if (this.editingCommentIndex) {
            this.posts[this.editingCommentIndex] = response;
  
          }
        },
        (error) => {
          console.error('Error updating comment:', error);
          // Handle error as needed
        }
      );
    } else {
      // You are in normal comment mode, handle post logic here
      this.postService.createComment(post,this.user_id).subscribe(
        (response) => {
          // Assuming the server returns the newly created post
          this.posts.push(response);
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

  getAllPosts(){
    this.postService.allPosts().subscribe(
      (response) => {
       console.log("response is ",response.posts);
       this.posts = response.posts.filter(post => post.postType == "post");
       
       
      }
    )
  }

  replyToComment(entry:any) {
    this.textArea = `@${entry.author} `;
    this.textAreaVisible = true;
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
    this.toastr.success('Likes Updated', 'Success');

  }

  addComment(post: Post, comment: string): void {
    console.log("hgj");
    
    // post.comments.push(comment);
  }

  toggleBookmark(post: Post): void {
    // post.isBookmarked = !post.isBookmarked;
    this.toastr.success('Bookmark Updated', 'Success');

  }

  discussionData = [


    {
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp',
      author: 'Maria Smantha',
      time: '2 hours ago',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page.',
      replies: [
        {
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(11).webp',
          author: 'Simona Disa',
          time: '3 hours ago',
          content: "letters, as opposed to using 'Content here, content here', making it look like readable English."
        },
        {
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp',
          author: 'John Smith',
          time: '4 hours ago',
          content: 'the majority have suffered alteration in some form, by injected humour, or randomised words.'
        }
      ]
    },

    // ... Add more discussion entries as needed
  ];


  deleteEntry(entry: any) {
    // Implement your delete logic here
    this.discussionData.splice(entry);
  }

  constructor(private router: Router,private toastr: ToastrService,private postService:PostService) {
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
  
}