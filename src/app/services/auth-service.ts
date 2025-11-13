import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient){}
  
  login(username: String, password: String): Observable<any> {
    const url = Env.baseUrl + '/auth/login';
    return this.http.post(
      url,
      {
        "email": username,
        "password": password,
        "platform": "WEB_ADMIN"
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}
