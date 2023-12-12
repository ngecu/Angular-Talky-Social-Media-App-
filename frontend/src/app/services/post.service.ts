import { PostDetails } from '../interfaces/post';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  createPost (post: PostDetails){
    return this.http.post('http://localhost:4400/post/', post)
  }
}
