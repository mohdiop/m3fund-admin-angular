import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Env } from '../env';
import { ResponseError } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  
  constructor(
    private http: HttpClient
  ) {}

  getPendingForDisbursingCampaigns(): Observable<any> {
    const url = `${Env.baseUrl}/projects/campaigns/not-disbursed`;
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    })
    return this.http.get(url, {headers})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error as ResponseError)
      })
    );
  } 

  disburse(campaignId: number): Observable<any> {
    const url = `${Env.baseUrl}/projects/campaigns/${campaignId}/disburse`
    const accessToken = localStorage.getItem('accessToken')
    const headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    });
    return this.http.post(
      url,
      {},
      {headers}
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error as ResponseError)
      })
    );
  }
}
