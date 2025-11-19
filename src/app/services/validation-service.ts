import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Env } from '../env';
import { ResponseError } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private http: HttpClient) {}

  getAllOwnersPendingValidations(): Observable<any> {
    const url = `${Env.baseUrl}/validations/owners`;
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.get(
      url,
      {headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }

  validateOwner(ownerId: number): Observable<any> {
    const url = `${Env.baseUrl}/validations/owners/${ownerId}/validate`;
    const accessToken = localStorage.getItem("accessToken");
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }

  refuseOwner(ownerId: number): Observable<any> {
    const url = `${Env.baseUrl}/validations/owners/${ownerId}/refuse`;
    const accessToken = localStorage.getItem("accessToken");
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }
}
