import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ResponseError } from '../models/interfaces';
import { Env } from '../env';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  
  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    const token = localStorage.getItem("accessToken")
    const url = Env.baseUrl + "/stats/dashboard"

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    })

    return this.http.get(
      url,
      {headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
      );
  }
}
