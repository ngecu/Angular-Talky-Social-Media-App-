import { Component } from '@angular/core';
import 'boxicons'
import { Post } from '../interfaces/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  public openPopup: Function | undefined;

  textArea: string = '';
  textAreaVisible: boolean = false;

  // Other component methods and properties...

  populateTextArea(author: string) {
    this.textArea = `@${author} `;
    this.textAreaVisible = true;
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


  posts: Post[] = [
    {
      username: 'samkolder',
      profileImage: 'assets/images/profiles/profile-1.jpg',
      timeAgo: '3 days',
      images: [
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg',
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg',
        'https://www.hdcarwallpapers.com/walls/super_sports_cars-HD.jpg'
      ],
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
  }

  addComment(post: Post, comment: string): void {
    post.comments.push(comment);
  }

  toggleBookmark(post: Post): void {
    post.isBookmarked = !post.isBookmarked;
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

}
