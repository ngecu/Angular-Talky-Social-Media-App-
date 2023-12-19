import { Post, PostDetails } from '../interfaces/post';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../interfaces/comment';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface PostResponse {
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  createPost (post: PostDetails): Observable<any>{
    return this.http.post<any>('http://localhost:4400/post/', post)
  }

 

  followingPosts(following_user_id:string){
    return this.http.get(`http://localhost:4400/post/${following_user_id}`)

  }

  allPosts(): Observable<PostResponse> {
    return this.http.get<PostResponse>('http://localhost:4400/post/');
  }
  singlePost(post_id:string): Observable<PostResponse> {
    return this.http.get<PostResponse>(`http://localhost:4400/post/single/${post_id}`);
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

  toggleLikePost(post_id:string,user_id:string): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`, // Add the token from localStorage
    });

    const postData = {
      post_id: post_id,
      user_id: user_id,
    };

    return this.http.post<Post>(`http://localhost:4400/post/toggleLikePost`,postData, { headers });

  }

  commentOnComment(post:Post,comment_id: string, user_id: string,actualtext:string): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`, // Add the token from localStorage
    });

    const commentData = {
      post_id: post.post_id,
      created_by_user_id: user_id,
      comment: actualtext,
      comment_replied_to_id:comment_id
    };

    return this.http.post<Post>(`http://localhost:4400/post/comment`, commentData, { headers });
  }


  userPosts(): Observable<any>{
    const storedUser: string | null = localStorage.getItem('user_details');
    let user_id = ""

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`, // Add the token from localStorage
    });

    if(storedUser){
      user_id = JSON.parse(storedUser).user_id;
   
   
    }
   
    return this.http.get<any>(`http://localhost:4400/post/user/${user_id}`,{headers}).pipe(
     catchError(error => {
       console.error('Error checking details:', error);
       return throwError(error); 
     })
   );
  }

  deletePost(postId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${localStorage.getItem('token')}`
    });

    const url = `http://localhost:4400/post/${postId}`;

    return this.http.delete(url, { headers });
  }

}
