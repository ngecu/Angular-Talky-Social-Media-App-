import { Post, PostDetails } from '../interfaces/post';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../interfaces/comment';
import { Observable } from 'rxjs';

interface PostResponse {
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  createPost (post: PostDetails){
    return this.http.post('http://localhost:4400/post/', post)
  }

 

  followingPosts(following_user_id:string){
    return this.http.get(`http://localhost:4400/post/${following_user_id}`)

  }

  allPosts(): Observable<PostResponse> {
    return this.http.get<PostResponse>('http://localhost:4400/post/');
  }

  createComment(post: Post, user_id: string): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`, // Add the token from localStorage
    });

    const commentData = {
      post_id: post.post_id,
      created_by_user_id: user_id,
      comment: post.comment, // Assuming commentText is the property where the comment text is stored
    };

    return this.http.post<Post>(`http://localhost:4400/post/comment`, commentData, { headers });
  }

  updateComment(post: Post,comment_id:string): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`, // Add the token from localStorage
    });

    const commentData = {
      post_id: post.post_id,
      comment: post.comment, 
    };

    return this.http.put<Post>(`http://localhost:4400/post/comment${comment_id}`, commentData, { headers });
  }

  deleteComment(comment_id:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`, // Add the token from localStorage
    });

    return this.http.delete<Post>(`http://localhost:4400/post/comment/${comment_id}`, { headers });

  }

}
