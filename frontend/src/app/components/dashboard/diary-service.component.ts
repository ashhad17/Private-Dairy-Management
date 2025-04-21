import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
// getEntryById(arg0: string): import("./components/types").DiaryEntry|null {
// throw new Error('Method not implemented.');
// }
  private dummyEntries: DiaryEntry[] = [
    {
      _id: '1',
      title: 'Happy Day',
      content: 'Today was an amazing day! The weather was perfect and I had a great time with friends.',
      mood: 'happy',
      tags: ['friends', 'outdoor'],
      createdAt: '2023-05-15T09:00:00Z',
      updatedAt: '2023-05-15T09:00:00Z'
    },
    {
      _id: '2',
      title: 'Work Stress',
      content: 'The project deadline is approaching and I feel overwhelmed with all the tasks.',
      mood: 'anxious',
      tags: ['work', 'deadline'],
      createdAt: '2023-05-14T18:30:00Z',
      updatedAt: '2023-05-14T18:30:00Z'
    },
    {
      _id: '3',
      title: 'Feeling Grateful',
      content: 'I woke up feeling grateful for my health and family today. Small things matter.',
      mood: 'grateful',
      tags: ['family', 'health'],
      createdAt: '2023-05-13T07:15:00Z',
      updatedAt: '2023-05-13T07:15:00Z'
    },
    {
      _id: '4',
      title: 'Rainy Day Blues',
      content: 'The whole day it rained and I felt a bit lonely. Maybe I should call someone.',
      mood: 'sad',
      tags: ['weather', 'lonely'],
      createdAt: '2023-05-12T16:45:00Z',
      updatedAt: '2023-05-12T16:45:00Z'
    },
    {
      _id: '5',
      title: 'Angry Moment',
      content: 'Someone took credit for my work today. I need to speak up about this tomorrow.',
      mood: 'angry',
      tags: ['work', 'conflict'],
      createdAt: '2023-05-11T20:00:00Z',
      updatedAt: '2023-05-11T20:00:00Z'
    }
  ];

  constructor() {}

  // Get all entries with simulated delay
  getEntries(): Observable<DiaryEntry[]> {
    return of([...this.dummyEntries]).pipe(delay(500));
  }

  // Filter entries by mood
  getFilteredEntries(mood: string): Observable<DiaryEntry[]> {
    const filtered = this.dummyEntries.filter(entry => entry.mood === mood);
    return of(filtered).pipe(delay(300));
  }

  // Filter entries by date
  getFilteredEntriesByDate(date: Date): Observable<DiaryEntry[]> {
    const filtered = this.dummyEntries.filter(entry => 
      new Date(entry.createdAt).toDateString() === date.toDateString()
    );
    return of(filtered).pipe(delay(300));
  }

  // Create new entry
  createEntry(entry: Omit<DiaryEntry, '_id' | 'createdAt' | 'updatedAt'>): Observable<DiaryEntry> {
    const newEntry: DiaryEntry = {
      ...entry,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.dummyEntries.unshift(newEntry);
    return of(newEntry).pipe(delay(400));
  }

  // Update existing entry
  updateEntry(id: string, entry: Partial<DiaryEntry>): Observable<DiaryEntry> {
    const index = this.dummyEntries.findIndex(e => e._id === id);
    if (index !== -1) {
      const updatedEntry = { 
        ...this.dummyEntries[index], 
        ...entry,
        updatedAt: new Date().toISOString()
      };
      this.dummyEntries[index] = updatedEntry;
      return of(updatedEntry).pipe(delay(400));
    }
    throw new Error('Entry not found');
  }

  // Delete entry
  deleteEntry(id: string): Observable<{ message: string }> {
    const initialLength = this.dummyEntries.length;
    this.dummyEntries = this.dummyEntries.filter(entry => entry._id !== id);
    if (this.dummyEntries.length === initialLength) {
      throw new Error('Entry not found');
    }
    return of({ message: 'Entry deleted successfully' }).pipe(delay(300));
  }
}