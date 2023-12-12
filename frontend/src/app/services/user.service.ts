import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails, toggleFollowUserInterface } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }



  getAllUsers(){
    let token = localStorage.getItem('token') as string
    return this.http.get<{users: UserDetails[]}>('http://localhost:4400/user', {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': token
      })
    })
  }


  toggleFollowUser (usersDetails:toggleFollowUserInterface){
    return this.http.post('http://localhost:4400/user/toggleFollowUser',usersDetails)
  }

}
