import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Env } from '../env';
import { AuthRequest, ResponseError } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient){}
  
  login(authRequest: AuthRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url = Env.baseUrl + '/auth/login';
    return this.http.post(
      url,
      authRequest,
      {headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
      );
  }

  logout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.setItem("isAuthenticated", "false")
  }
}
