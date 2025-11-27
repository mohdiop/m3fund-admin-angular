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

  getAllProjectsPendingValidations(): Observable<any> {
    const url = `${Env.baseUrl}/validations/projects`;
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

  validateOwner(validationId: number): Observable<any> {
    const url = `${Env.baseUrl}/validations/${validationId}/owners/validate`;
    const accessToken = localStorage.getItem("accessToken");
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {},
      {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }

  refuseOwner(validationId: number): Observable<any> {
    const url = `${Env.baseUrl}/validations/${validationId}/owners/refuse`;
    const accessToken = localStorage.getItem("accessToken");
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {},
      {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }

  validateProject(validationId: number): Observable<any> {
    const url = `${Env.baseUrl}/validations/${validationId}/projects/validate`;
    const accessToken = localStorage.getItem("accessToken");
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {},
      {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }

  refuseProject(validationId: number): Observable<any> {
    const url = `${Env.baseUrl}/validations/${validationId}/projects/refuse`;
    const accessToken = localStorage.getItem("accessToken");
    const headers = new HttpHeaders({
      "Content-type": "application/json", 
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {},
      {headers: headers}
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error as ResponseError);
        })
    );
  }
}
