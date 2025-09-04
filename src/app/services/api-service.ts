import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient
  ) {}

  private apiUrl: string = "https://my-json-api-i00y.onrender.com";

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  signUp(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }




  /// GET student

  getStudent(params: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.apiUrl}/students`, { observe: 'response', params});
  }

  addStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students`, student);
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`)
  }




  // Get Teachers

  getTeacher(params: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers`, { observe: 'response', params});
  }

  addTeacher(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, student);
  }

  updateTeacher(id: number, student: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teachers/${id}`, student);
  }

  deleteTeacher(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teachers/${id}`)
  }
  
}
