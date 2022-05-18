import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserLogin } from './userModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  user: User;
  userLogged: boolean;

  public get User() {
    return this.user;
  }

  public set User(user: User) {
    this.user = user;
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`https://localhost:44318/User`);
  }

  public getUser(username: string): Observable<User> {
    username = username.trim();
    return this.http.get<User>(`https://localhost:44318/User/${username}`);
  }

  public loginUser(user: UserLogin) {
    return this.http.post('https://localhost:44318/User', user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`https://localhost:44318/User`, user);
  }
}
