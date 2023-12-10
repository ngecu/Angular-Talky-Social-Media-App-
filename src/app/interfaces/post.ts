export interface Post {
    username: string;
    profileImage: string;
    timeAgo: string;
    images: string[];
    likes: number;
    description: string;
    comments: string[];
    isLiked: boolean;
    isBookmarked: boolean;
  }