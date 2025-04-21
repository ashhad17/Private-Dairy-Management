import { Component, OnInit } from '@angular/core';
import { DiaryService } from '../../diary/diary.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';
import { AuthService } from '../../services/auth.service';
import { RelativeTimePipe } from '../../diary/home/relative-time.pipe';
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule,RelativeTimePipe],
  templateUrl: './dashboard-ui.component.html',
  styleUrls: ['./dashboard-ui.component.scss'],
})
export class HomeComponent implements OnInit {
  userName: string = '';
  entries: any[] = [];
  filter: string = '';
  newEntry: any = {
    title: '',
    content: '',
    tags: [''],
    mood: 'Happy', // Default mood
  };
  showModal: boolean = false;
  editMode: boolean = false;
  editEntryId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  viewEntry: any = null;

  showReminderModal: boolean = false;
  moods = [
    
    { value: 'All', label: 'All ' },
    { value: 'Happy', label: 'Happy 😊' },
    { value: 'Sad', label: 'Sad 😔' },
    { value: 'Angry', label: 'Angry 😡' },
    { value: 'Excited', label: 'Excited 😃' },
    { value: 'Neutral', label: 'Neutral 😐' },
    { value: 'Anxious', label: 'Anxious 😰' },
    { value: 'Grateful', label: 'Grateful 🙏' },
    { value: 'Lonely', label: 'Lonely 😞' },
    { value: 'Motivated', label: 'Motivated 💪' },
    { value: 'Tired', label: 'Tired 😴' },
    { value: 'Confused', label: 'Confused 😕' },
    { value: 'Relaxed', label: 'Relaxed 🧘‍♂️' },
    { value: 'Stressed', label: 'Stressed 😣' },
    { value: 'Bored', label: 'Bored 😐' }
  ];
  updatedFromDate: string='';
  updatedToDate: string='';
  
  
  selectMood(mood: string) {
    this.newEntry.mood = mood;
  }
  
  moodsBtn: string[] = [
    'All',
    'Happy',
    'Sad',
    'Angry',
    'Excited',
    'Neutral',
    'Anxious',
    'Grateful',
    'Lonely',
    'Motivated',
    'Tired',
    'Confused'
  ];
  
  selectedMood: string = 'All';
  selectedDate: string = '';
  tagInput = '';

  tagInputValue: string = '';
  addTagFromInput(event: Event): void {
    event.preventDefault(); // prevent form submit
    const value = this.tagInput.trim();
    if (value && !this.newEntry.tags.includes(value)) {
      this.newEntry.tags.push(value);
    }
    this.tagInput = '';
  }
onDateChange(event: any): void {
  const selected = new Date(event.target.value);
  this.filterEntriesByDate(selected);
}

filterEntriesByDate(date: Date) {
  this.entries = this.entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate.toDateString() === date.toDateString();
  });
}

  filterByMood(mood: string): void {
    this.selectedMood = mood;
    this.filter = mood === 'All' ? '' : mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
    this.applyFilter(); // reuse your existing logic
  }
  
openReminderModal() {
  this.showReminderModal = true;
}

closeReminderModal() {
  this.showReminderModal = false;
}
  constructor(private diaryService: DiaryService,public auth: AuthService) {}

  ngOnInit(): void {
    this.loadEntries();
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userName = decoded.name;
    }
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }
  // Safely get tags as array
  getTags(entry: any): string[] {
    if (!entry.tags) return [];
    return Array.isArray(entry.tags) ? entry.tags : entry.tags.split(',').filter((t: string) => t.trim());
  }
  openViewModal(entry: any) {
    this.viewEntry = entry;
  }
  
  closeViewModal() {
    this.viewEntry = null;
  }
  // applyFilter(): void {
  //   this.isLoading = true;
  //   this.errorMessage = '';
  
  //   // Trim and clean up tags string
  //   const cleanedTags = this.filter
  //     .split(',')
  //     .map(tag => tag.trim())
  //     .filter(tag => tag.length > 0)
  //     .join(',');
  
  //   this.diaryService.getFilteredEntries(cleanedTags).subscribe({
  //     next: (data) => {
  //       this.entries = data;
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error applying filter', error);
  //       this.errorMessage = 'Failed to apply filter';
  //       this.isLoading = false;
  //     }
  //   });
  // }
  applyFilter(): void {
    this.isLoading = true;
    this.errorMessage = '';
  
    // Clean the filter input
    const cleanedTags = this.filter
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .join(',');
  
    console.log('Filter Tags:', cleanedTags); // Add this line
  
    this.diaryService.getFilteredEntries(cleanedTags).subscribe({
      next: (data) => {
        console.log('Filtered Entries:', data); // Add this line to check response
        this.entries = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error applying filter', error);
        this.errorMessage = 'Failed to apply filter';
        this.isLoading = false;
      }
    });
  }
  
  clearDateFilter(): void {
    this.updatedFromDate = '';
    this.updatedToDate = '';
    this.loadEntries();
  }
  
  
  filterByUpdatedDate(): void {
    this.isLoading = true;
    const from = this.updatedFromDate ? new Date(this.updatedFromDate).toISOString() : undefined;
    const to = this.updatedToDate ? new Date(this.updatedToDate).toISOString() : undefined;
  
    this.diaryService.filterEntriesByUpdatedDate(from, to).subscribe({
      next: (data) => {
        this.entries = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error filtering by updated date:', error);
        this.errorMessage = 'Failed to filter by updated date';
        this.isLoading = false;
      }
      
    });
  }
  loadEntries() {
    this.isLoading = true;
    this.diaryService.getEntries().subscribe({
      next: (data) => {
        this.entries = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading entries', error);
        this.errorMessage = 'Failed to load entries';
        this.isLoading = false;
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.editMode = false;
    this.newEntry = { 
      title: '', 
      content: '', 
      tags: [] as string[],
      mood: 'happy' 
    };
    this.errorMessage = '';
  }
  // reminder-settings.component.ts
reminderEnabled = false;
reminderTime = '20:00'; // default 8 PM

saveReminderPreference() {
  const payload = {
    reminderEnabled: this.reminderEnabled,
    reminderTime: this.reminderTime,
  };

  this.diaryService.setReminder(payload).subscribe({

  });

 
}

 
  analyzeContent() {
    if (!this.newEntry.content.trim()) return;
  
    this.isLoading = true;
    console.log(this.diaryService.analyzeEntryContent(this.newEntry.content));
    this.diaryService.analyzeEntryContent(this.newEntry.content).subscribe({
      next: (result) => {
        console.log('Analyzed result:', result);
        this.newEntry.title = result.title || '';
        this.newEntry.mood = result.mood || 'neutral';
        this.newEntry.tags = result.tags || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error analyzing content', err);
        this.errorMessage = 'Failed to analyze content';
        this.isLoading = false;
      }
    });
  }
  logout() {
    this.auth.logout();
    localStorage.removeItem('token');
  }
  
  openEditModal(entry: any) {
    this.showModal = true;
    this.editMode = true;
    this.newEntry = { 
      ...entry, 
      tags: this.getTags(entry).length ? this.getTags(entry) : [''] 
    };
    this.editEntryId = entry._id;
    this.errorMessage = '';
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
  }

  // addTag() {
  //   this.newEntry.tags.push('');
  // }

  // removeTag(index: number) {
  //   if (this.newEntry.tags.length > 1) {
  //     this.newEntry.tags.splice(index, 1);
  //   } else {
  //     this.newEntry.tags[0] = ''; // Keep at least one empty tag
  //   }
  // }

  addTag() {
    const tag = this.tagInputValue.trim();
    console.log('Adding tag:', this.newEntry.tags);
    if (tag && !this.newEntry.tags.includes(tag)) {
      this.newEntry.tags.push(tag);
    }
    this.tagInputValue = '';
  }
  
  removeTag(index: number) {
    this.newEntry.tags.splice(index, 1);
  }
  
  removeLastTag(event: KeyboardEvent) {
    if (!this.tagInputValue && this.newEntry.tags.length && event.key === 'Backspace') {
      this.newEntry.tags.pop();
    }
  }
  
  submitEntry() {
    this.isLoading = true;
  this.newEntry.mood=this.newEntry.mood.charAt(0).toUpperCase() + this.newEntry.mood.slice(1).toLowerCase();
    const payload = {
      
      ...this.newEntry,
      tags: this.newEntry.tags.filter((t: string) => t.trim()) // Send as array!
    };
  
    console.log('Submitting payload:', payload); // <-- Check this in console
  
    const request = this.editMode 
      ? this.diaryService.updateEntry(this.editEntryId, payload)
      : this.diaryService.createEntry(payload);
  
    request.subscribe({
      next: () => {
        this.loadEntries();
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving entry', error); // <--- See backend error
        this.errorMessage = 'Failed to save entry';
        this.isLoading = false;
      }
    });
  }
  

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.isLoading = true;
      this.diaryService.deleteEntry(id).subscribe({
        next: () => {
          this.loadEntries();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting entry', error);
          this.errorMessage = 'Failed to delete entry';
          this.isLoading = false;
        }
      });
    }
  }
}