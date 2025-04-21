import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private apiUrl = 'http://localhost:5000/api/diary'; // Adjust backend URL if needed

  constructor(private http: HttpClient) {}

  // Fetch all diary entries
  getEntries(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
 setReminder(payload: { reminderEnabled: boolean; reminderTime: string; }){
  return this.http.post('http://localhost:5000/api/diary/reminder-preference', payload);
 }
  // Fetch filtered diary entries
  getFilteredEntries(tags: string): Observable<any> {
    return this.http.get(`http://localhost:5000/api/diary/filter?mood=${encodeURIComponent(tags)}`);
  }

  // getFilteredEntries(tags: string = '', mood: string = '', updatedFrom?: string, updatedTo?: string) {
  //   let params: any = {};
  
  //   if (tags) params.tags = tags;
  //   if (mood && mood !== 'All') params.mood = mood;
  //   if (updatedFrom) params.updatedFrom = updatedFrom;
  //   if (updatedTo) params.updatedTo = updatedTo;
  
  //   return this.http.get<any[]>(`${this.apiUrl}/entries/filter`, { params });
  // }
  
  // http://localhost:5000/api/diary/filter?mood=sad
  // Create a new diary entry

  filterEntriesByUpdatedDate(fromDate?: string, toDate?: string) {
    const params: any = {};
    if (fromDate) params.updatedFrom = fromDate;
    if (toDate) params.updatedTo = toDate;
  
    return this.http.get<any[]>('http://localhost:5000/api/entries/filter-by-date', { params });
  }
  
  createEntry(entry: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, entry);
  }
  analyzeEntryContent(content: string) {
    return this.http.post<any>('http://localhost:5000/api/diary-ai/analyze', { content });
  }
  
  // Update an existing diary entry
  updateEntry(id: string, entry: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, entry);
  }

  // Delete a diary entry
  deleteEntry(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
