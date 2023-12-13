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

  textAreaVisible: boolean = false;


  replyToComment(entry:any) {
    this.textArea = `@${entry.author} `;
    this.textAreaVisible = true;
  }


  editextArea(author: string) {
    this.textArea = `${author} `;
    this.textAreaVisible = true;
  }

  setPopupAction(fn: any) {
      this.openPopup = fn;
  }

  postComment(post: Post){
    console.log(this.textArea2);
    const comment_body = {
      created_by_user_id:"Robin",
      post_id:post.id,
      comment : this.textArea2,
      comment_replied_to_id:"",
      created_at:new Date().toISOString()
    }
    this.postService.createComment(comment_body).subscribe(
      (response) => {
        post.comments.length = post.comments.length + 1
        this.toastr.success("response", 'Success');
      }
    )


  }

  onEnterFunction(){

    console.log("ghf")
  }

  isEmojiPickerVisible: boolean | undefined;
  public addEmoji(event: { emoji: { native: any; }; }) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }


  posts: Post[] = [
    {
     id:"1",
      username: 'Jonathan Mwaniki',

      verified:true,
      profileImage: 'assets/images/profiles/profile-1.jpg',
      timeAgo: '3 days',
      images: [
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg',
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg',
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg'
      ],
      likes: 365354,
      description: 'Swipe 😂😂 #memes',
      comments: ['Comment 1', 'Comment 2'],
      isLiked: false,
      isBookmarked: false
    },

    {
      id:"2",
      username: 'Dev Ngecu',
      verified:false,
      profileImage: 'assets/images/profiles/profile-1.jpg',
      timeAgo: '3 days ago',
      images: [
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg',      ],
      likes: 365354,
      description: 'Lil drone shot I got a while back but never posted.',
      comments: ['Comment 1', 'Comment 2'],
      isLiked: false,
      isBookmarked: false
    },

    {
      id:"3",
      username: 'Marioo',
      verified:true,
      profileImage: 'assets/images/profiles/profile-1.jpg',
      timeAgo: '3 days',
      images: [
        'assets/video/1.mp4'
            ],
      likes: 365354,
      description: 'Lil drone shot I got a while back but never posted.',
      comments: ['Comment 1', 'Comment 2'],
      isLiked: false,
      isBookmarked: false
    },

    {
      id:"4",
      username: 'Marioo',
      verified:true,
      profileImage: 'assets/images/profiles/profile-1.jpg',
      timeAgo: '3 days',
      images: [],
      likes: 365354,
      description: 'Lil drone shot I got a while back but never posted.',
      comments: ['Comment 1', 'Comment 2'],
      isLiked: false,
      isBookmarked: false
    },

    

    // Add more posts as needed
  ];

  toggleLike(post: Post): void {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    this.toastr.success('Likes Updated', 'Success');

  }

  addComment(post: Post, comment: string): void {
    post.comments.push(comment);
  }

  toggleBookmark(post: Post): void {
    post.isBookmarked = !post.isBookmarked;
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
