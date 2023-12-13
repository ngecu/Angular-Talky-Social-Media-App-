import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from '../interfaces/user';
import { userLogin } from '../interfaces/login';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  private baseUrl = 'http://localhost:4400/user/';

  createUser (user: UserDetails){
    return this.http.post('http://localhost:4400/user/register', user)
  }

  loginUser(user: userLogin): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}/login`, user, { headers }).pipe(
      tap(response => {
        const token = response.token;
        localStorage.setItem('token', token);
        console.log('Token:', token);
      }),
      catchError(error => {
        console.error('Error logging in:', error);
        throw error; // Handle the error as needed
      })
    );
  }

  checkDetails(): Observable<any> {
    const token = localStorage.getItem('token') as string;
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': token
    });
  
    return this.http.get<any>('http://localhost:5000/user/check_user_details', { headers }).pipe(
      catchError(error => {
        console.error('Error checking details:', error);
        return throwError(error); 
      })
    );
  
}

}
