import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import {
  CreateNameCardTemplateDto,
  UpdateNameCardTemplateDto,
} from '../models/name-card-template.model';

@Injectable({
  providedIn: 'root',
})
export class NameCardTemplateService {
  constructor(private http: HttpClient) {}

  getNameCardTemplates(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/NameCardTemplate`);
  }

  createNameCardTemplate(
    createNameCardTemplateDto: CreateNameCardTemplateDto
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/NameCardTemplate`,
      createNameCardTemplateDto
    );
  }

  getNameCardTemplateById(id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/NameCardTemplate/${id}`
    );
  }

  updateNameCardTemplate(
    updateNameCardTemplateDto: UpdateNameCardTemplateDto
  ): Observable<any> {
    return this.http.patch<any>(
      `${environment.apiBaseUrl}/NameCardTemplate`,
      updateNameCardTemplateDto
    );
  }
}
