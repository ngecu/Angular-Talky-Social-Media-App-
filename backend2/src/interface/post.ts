export interface Post {
  postContent: string;
  imageUrl: string;
  postID: string;
  userID: string;
}

export interface Comment {
  comment: string;
  commentID: string;
  postID: string;
  userID: string;
}

export interface replyCommentBody {
  commentID: string;
  parentCommentID: string;
  comment: string;
  postID: string;
  userID: string;
}
