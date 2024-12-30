import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mosque } from './mosques/mosque.model'; // Import the Mosque interface
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MosqueService {
  private apiUrl = environment.apiUrl + '/mosques';
  
  constructor(private http: HttpClient) {}

  getMosques(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addMosque(mosque: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, mosque);
  }

  deleteMosque(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMosqueById(id: string): Observable<Mosque> {
    return this.http.get<Mosque>(`${this.apiUrl}/${id}`);
  }
  
  updateMosque(id: string, updatedData: Mosque): Observable<Mosque> {
    return this.http.put<Mosque>(`${this.apiUrl}/${id}`, updatedData);
  }

}