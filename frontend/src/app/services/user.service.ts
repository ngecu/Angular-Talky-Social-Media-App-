import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserDetails, toggleFollowUserInterface } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }



  getAllUsers() {
    let token = localStorage.getItem('token') as string;
    return this.http.get<{ users: UserDetails[] }>('http://localhost:4400/user', {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': token
      })
    }).pipe(
      map(response => response.users) 
    );
  }

  getFollowers(followed_user_id: string) {
    let token = localStorage.getItem('token') as string;
    return this.http.post<{ followers: UserDetails[] }>(
      'http://localhost:4400/user/getFollowers',
      { followed_user_id }, 
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'token': token
        })
      }
    ).pipe(
      map(response => response.followers)
    );
  }
  
  getFollowings(following_user_id: string) {
    let token = localStorage.getItem('token') as string;
    return this.http.post<{ followings: UserDetails[] }>(
      'http://localhost:4400/user/getFollowings',
      { following_user_id }, 
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'token': token
        })
      }
    ).pipe(
      map(response => response.followings)
    );
  }
  



  


  toggleFollowUser (usersDetails:toggleFollowUserInterface){
    let token = localStorage.getItem('token') as string;
    return this.http.post('http://localhost:4400/user/toggleFollowUser',usersDetails, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': token
      })
    })
  }

  getSuggestions() {
    let token = localStorage.getItem('token') as string;
    let user_id
    const storedUser = localStorage.getItem('user_details');
    if(storedUser){
      const user = JSON.parse(storedUser)
      user_id = user.user_id

    }

    return this.http.get<{ suggestions: any[] }>(
      `http://localhost:4400/user/getFollowSuggestions/${user_id}`,
     
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'token': token
        })
      }
    ).pipe(
      map(response => response.suggestions)
    );
  }

  updateProfile(profileData: any): Observable<any> {
    const token = localStorage.getItem('token') as string;
    const storedUser: string | null = localStorage.getItem('user_details');
    let user_id = ""
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: token,
    });

    if(storedUser){
      user_id = JSON.parse(storedUser).user_id;
   
   
    }

    return this.http.put<{ message: string }>(`http://localhost:4400/user/${user_id}/profile`, profileData, { headers }).pipe(
      map(response => response.message)
    );
  }

  sendResetToken(emailData: any): Observable<any> {
  

    return this.http.post<{ message: string }>(`http://localhost:4400/user/reset-password`, emailData).pipe(
      map(response => response.message)
    );
  }

  resetPwd(user_id: string, password: string): Observable<any> {
    let token = localStorage.getItem('token') as string;
    const body = {
      password
    };
  
    return this.http.post<{ message: string }>(
      `http://localhost:4400/user/setNewPassword/${user_id}`,
      body     
    ).pipe(
      map(response => response.message)
    );
  }
  

  
}



