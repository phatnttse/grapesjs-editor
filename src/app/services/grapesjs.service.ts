import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsService {
  constructor(private http: HttpClient) {}

  Cloudinary_Upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      `${environment.apiBaseUrl}/Grapesjs/Cloudinary_UploadFile`,
      formData
    );
  }

  Image_Upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${environment.apiBaseUrl}/GrapesJs/Image_Upload`,
      formData
    );
  }

  Video_Upload(video: File, title: string, poster: string): Observable<any> {
    const formData = new FormData();
    formData.append('videoFile', video);
    formData.append('title', title);
    formData.append('poster', poster);
    return this.http.post<any>(
      `${environment.apiBaseUrl}/Grapesjs/Video_Upload`,
      formData
    );
  }

  Image_GetAll(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/Grapesjs/Image_GetAll`
    );
  }

  Video_GetAll(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/Grapesjs/Video_GetAll`
    );
  }

  Content_GetFromUrl(url: string): Observable<any> {
    return this.http.get(`${url}?` + Date.now(), {
      responseType: 'text',
    });
  }

  Image_Delete(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiBaseUrl}/Grapesjs/Image_Delete/${id}`
    );
  }

  Video_Delete(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiBaseUrl}/Grapesjs/Video_Delete/${id}`
    );
  }
}
