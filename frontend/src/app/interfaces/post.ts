export interface Post {
  post_id: string;
  created_by_user_id: string;
  caption: string;
  postType: string;
  created_at: string;
  comment:string

}

  export interface PostDetails{
    post_id?:string,
    postImage:string,
    created_by_user_id:string,
    caption: string,
    postType: string,
    created_at:string,
}