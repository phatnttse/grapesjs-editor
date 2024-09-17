import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { InsertUpdateNameCardTemplateDto } from '../models/name-card-template.model';

@Injectable({
  providedIn: 'root',
})
export class NameCardTemplateService {
  constructor(private http: HttpClient) {}

  NameCardTemplate_GetAll(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/NameCardTemplate`);
  }

  NameCardTemplate_GetById(id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/NameCardTemplate/${id}`
    );
  }

  NameCardTemplate_InsertUpdate(
    insertUpdateNameCardTemplateDto: InsertUpdateNameCardTemplateDto
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/NameCardTemplate`,
      insertUpdateNameCardTemplateDto
    );
  }
}
