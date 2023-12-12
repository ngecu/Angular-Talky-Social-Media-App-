import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserDetails } from '../interfaces/user';
import { userLogin } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  
  createUser (user: UserDetails){
    return this.http.post('http://localhost:4400/user/register', user)
  }

  loginUser (user: userLogin){
    return this.http.post('http://localhost:4400/user/login', user)
  }
}