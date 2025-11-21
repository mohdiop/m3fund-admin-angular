import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Env } from '../env';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ResponseError } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {

  constructor(private http: HttpClient) {}
  
  getOwnerById(ownerId: number): Observable<any> {
    const url = `${Env.baseUrl}/project-owners/${ownerId}`;
    const accessToken = localStorage.getItem('accessToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
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
