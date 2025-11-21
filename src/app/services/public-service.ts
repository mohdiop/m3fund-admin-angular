import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Env } from '../env';
import { ResponseError } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PublicService {

  constructor(private http: HttpClient) {}

  downloadFile(absolutePath: string): Observable<any> {
    const url = `${Env.baseUrl}/public/download?absolutePath=${encodeURIComponent(absolutePath)}`;
    return this.http.get(url, { responseType: 'blob' })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError (()=> error.error as ResponseError)
      })
    );
  }
}
