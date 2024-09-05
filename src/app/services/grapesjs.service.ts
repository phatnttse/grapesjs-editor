import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsService {
  constructor(private http: HttpClient) {}

  uploadCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      `${environment.apiBaseUrl}/Grapesjs/upload-cloudinary`,
      formData
    );
  }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${environment.apiBaseUrl}/GrapesJs/upload`,
      formData
    );
  }

  uploadVideo(
    video: File,
    title: string,
    description: string,
    poster: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('videoFile', video);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('poster', poster);
    return this.http.post<any>(
      `${environment.apiBaseUrl}/Grapesjs/upload-video`,
      formData
    );
  }

  getAssets(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/Grapesjs/assets`);
  }

  getContentFromUrl(url: string): Observable<any> {
    return this.http.get(`https://localhost:7191/${url}?` + Date.now(), {
      responseType: 'text',
    });
  }
}
