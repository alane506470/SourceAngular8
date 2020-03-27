import { Injectable } from '@angular/core';
import { Observable, of, concat } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError, retryWhen, delay, take, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private Local_HOST = 'http://localhost:8088/';
  private API_HOST = environment.ApiHost;
  private PCM_API_HOST = environment.PcmApiHost;
  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  getRemoteData(url: string) {
    // tslint:disable-next-line: no-console
    console.info('getRemotedata', url);
    return this.http.get(`${this.Local_HOST}${url}`)
      .pipe(
        delay(500),
        retry(2),
        catchError(this.handleError),
        );
  }

  // for download file
  getRemoteBlob(url: string) {
    console.info('getRemoteBlob', url);
    return this.http.get(`${this.API_HOST}${url}`, { responseType: 'blob', observe: 'response'})
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  // for download file by post method
  getRemoteBlobByPost(url: string, params: any, fileName?: any) {
    console.info('getRemoteBlob by post method with token', url);
    const dlHttpOptions: Object = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'blob'
    };
    this.http.post(`${this.Local_HOST}${url}`, params, dlHttpOptions).subscribe((data: any) => {
      console.log(data);
      this.snackbar.open('下載中，請稍後', null, {
        duration: 5000
      });
      const link = document.createElement('a');
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName + '_' + new Date().getFullYear() + '-' + (new Date().getUTCMonth() + 1)
        + '-' + new Date().getDate() +
        '-' + new Date().getHours() + '-' + new Date().getMinutes() + '-' + new Date().getSeconds() + '.xls');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
      error => {
        if (error.status === 500) {
          this.snackbar.open('查無資料', null, {
            duration: 5000
          });
        } else if (error.status === 401) {
          this.snackbar.open('請重新登入', null, {
            duration: 5000
          });
        } else {
          this.snackbar.open(error.message, null, {
            duration: 5000
          });
        }

      });
  }

  getSkuData(url: string, kcToken) {
    const httpOptions2 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    httpOptions2.headers.append('Authorization ', `Bearer ${kcToken}`);
    console.info('https inside', `${this.PCM_API_HOST}${url}`);
    return this.http.get(`${this.PCM_API_HOST}${url}`, httpOptions2)
      .pipe(
        retryWhen(
          errors =>
            // retry a failed request up to 3 times
            errors.pipe(delay(500), take(3))),
        catchError(this.handleError)
        );
        //catchError(this.handleError); // then handle the error
  }

  //   public getFile(path: string):Observable<any>{
  //       let options = new RequestOptions({responseType: ResponseContentType.Blob});
  //       return this.http.get(path, options)
  //           .map((response: Response) => <Blob>response.blob())  ;
  //     }
  postData(url: string, data) {
    console.info('http service post', data);
    return this.http.post(`${this.Local_HOST}${url}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  putData(url: string, data) {
    console.info('http service put', data);
    return this.http.put(`${this.Local_HOST}${url}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteData(url: string) {
    console.info('http service delete url =', url);
    return this.http.delete(`${this.Local_HOST}${url}`)
      .pipe(
        catchError(this.handleError)
      );


  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(error);
      if (error.status === 500 && error.error.cause === 'java.net.SocketTimeoutException: Read timed out') {
        return throwError(error.error);
      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    // return throwError(
    //   'Something bad happened; please try again later.');
    return throwError(error.error);
  }
}
