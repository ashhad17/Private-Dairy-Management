import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryService } from '../../diary/diary.service';
import { AuthService } from '../../services/auth.service';
import { RelativeTimePipe } from '../../diary/home/relative-time.pipe';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from '../email-verification/toast-message/toast.service';
import { ToastMessageComponent } from '../email-verification/toast-message/toast-message.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RelativeTimePipe,ToastMessageComponent,RouterModule],
  templateUrl: './dashboard-ui.component.html',
  styleUrls: ['./dashboard-ui.component.scss'],
})
export class HomeComponent implements OnInit {
  userName: string = '';
  entries: any[] = [];
  filteredEntries: any[] = [];
  filter: string = '';
  selectedMood: string = 'All';
  selectedDate: string = '';
  updatedFromDate: string = '';
  updatedToDate: string = '';
  tagInput = '';
  tagInputValue: string = '';

  newEntry: any = {
    title: '',
    content: '',
    tags: [''],
    mood: 'Happy',
  };

  moods = [
    { value: 'All', label: 'All' },
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

  moodsBtn: string[] = this.moods.map(m => m.value);

  showModal: boolean = false;
  editMode: boolean = false;
  editEntryId: string = '';
  viewEntry: any = null;
  showReminderModal: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  reminderEnabled = false;
  reminderTime = '20:00';
// Example format

  constructor(
    private diaryService: DiaryService,
    public auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // this.entries = this.loadEntries(); // Mock or real service call
    this.loadEntries();
    this.filteredEntries = [...this.entries];
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userName = decoded.name;
    }
    this.loadEntries();
  
  }

  trackByIndex(index: number): number {
    return index;
  }

  getTags(entry: any): string[] {
    if (!entry.tags) return [];
    return Array.isArray(entry.tags)
      ? entry.tags
      : entry.tags.split(',').map((t: string) => t.trim());
  }

  openModal() {
    this.showModal = true;
    this.editMode = false;
    this.newEntry = {
      title: '',
      content: '',
      tags: [],
      mood: 'Happy',
    };
    this.errorMessage = '';
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
  }

  openViewModal(entry: any) {
    this.viewEntry = entry;
  }

  closeViewModal() {
    this.viewEntry = null;
  }

  selectMood(mood: string) {
    this.newEntry.mood = mood;
  }

  addTagFromInput(event: Event) {
    event.preventDefault();
    const value = this.tagInput.trim();
    if (value && !this.newEntry.tags.includes(value)) {
      this.newEntry.tags.push(value);
    }
    this.tagInput = '';
  }

  addTag() {
    const tag = this.tagInputValue.trim();
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

  openEditModal(entry: any) {
    this.showModal = true;
    this.editMode = true;
    this.newEntry = {
      ...entry,
      tags: this.getTags(entry),
    };
    this.editEntryId = entry._id;
    this.errorMessage = '';
  }

  filterByMood(mood: string) {
    this.selectedMood = mood;
    this.filter = mood === 'All' ? '' : mood;
    this.applyFilter();
  }

  onDateChange(event: any) {
    const selected = new Date(event.target.value);
    this.filterEntriesByDate(selected);
  }

  filterEntriesByDate(date: Date) {
    this.entries = this.entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.toDateString() === date.toDateString();
    });
  }

  applyFilter() {
    this.isLoading = true;
    this.errorMessage = '';

    const cleanedTags = this.filter
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .join(',');

    this.diaryService.getFilteredEntries(cleanedTags).subscribe({
      next: (data) => {
        this.entries = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to apply filter';
        this.isLoading = false;
      }
    });
  }

  // filterByUpdatedDate() {
  //   this.isLoading = true;
  //   const from = this.updatedFromDate ? new Date(this.updatedFromDate).toISOString() : undefined;
  //   const to = this.updatedToDate ? new Date(this.updatedToDate).toISOString() : undefined;

  //   this.diaryService.filterEntriesByUpdatedDate(from, to).subscribe({
  //     next: (data) => {
  //       this.entries = data;
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Failed to filter by updated date';
  //       this.isLoading = false;
  //     }
  //   });
  // }

  filterByUpdatedDate() {
    // this.loadEntries();
    if (!this.updatedFromDate || !this.updatedToDate) return;

    const from = new Date(this.updatedFromDate);
    const to = new Date(this.updatedToDate);
    to.setHours(23, 59, 59, 999);

    this.filteredEntries = this.entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= from && entryDate <= to;
    });
    this.entries = [...this.filteredEntries];
  }

  clearDateFilter() {
    this.updatedFromDate = '';
    this.updatedToDate = '';
    this.loadEntries();
  }

  analyzeContent() {
    if (!this.newEntry.content.trim()) return;
    this.isLoading = true;

    this.diaryService.analyzeEntryContent(this.newEntry.content).subscribe({
      next: (result) => {
        this.newEntry.title = result.title || '';
        this.newEntry.mood = result.mood || 'Neutral';
        this.newEntry.tags = result.tags || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to analyze content';
        this.isLoading = false;
      }
    });
  }

  submitEntry() {
    this.isLoading = true;
    this.newEntry.mood = this.newEntry.mood.charAt(0).toUpperCase() + this.newEntry.mood.slice(1).toLowerCase();

    const payload = {
      ...this.newEntry,
      tags: this.newEntry.tags.filter((t: string) => t.trim()),
    };

    const request = this.editMode
      ? this.diaryService.updateEntry(this.editEntryId, payload)
      : this.diaryService.createEntry(payload);
    request.subscribe({
      next: () => {
        this.loadEntries();
        this.closeModal();
        this.isLoading = false;
        
      this.toast.showSuccess('Entry saved successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to save entry';
        
        this.isLoading = false;
        this.toast.showError('Failed to save entry');
      }
    });
  }
  shareOnFacebook() {
    const content = this.newEntry.content;  // Diary content
    const mood = this.newEntry.mood;        // Mood      // Date (formatted as needed)
    
    const message = encodeURIComponent(`Check out my diary entry! Mood: ${mood}, Content: ${content}`);
    
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${message}`;
    window.open(shareUrl, '_blank');
  }
  
  shareOnTwitter() {
    const content = this.viewEntry.content;
    const mood = this.viewEntry.mood;
    
    const tweetText = encodeURIComponent(`Check out my diary entry! Mood: ${mood} \n Content:$(content)`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(content)}`;
    window.open(shareUrl, '_blank');
  }
  
  shareOnLinkedIn() {
    const content = this.newEntry.content;
    const mood = this.newEntry.mood;
    
    const message = encodeURIComponent(`Check out my diary entry! Mood: ${mood}, Content: ${content}`);
    
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${message}`;
    window.open(shareUrl, '_blank');
  }
  
  
  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.isLoading = true;
      this.diaryService.deleteEntry(id).subscribe({
        next: () => {
          this.loadEntries();
          this.isLoading = false;
          this.toast.showSuccess('Entry deleted successfully');
        },
        error: () => {
          this.errorMessage = 'Failed to delete entry';
          this.isLoading = false;
          this.toast.showError('Failed to delete entry');
        }
      });
    }
  }

  loadEntries() {
    this.isLoading = true;
    this.diaryService.getEntries().subscribe({
      next: (data) => {
        this.filteredEntries = data;
        this.entries = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load entries';
        this.isLoading = false;
        this.toast.showError('Failed to load entries');
      }
    });
  }

  openReminderModal() {
    this.showReminderModal = true;
  }

  closeReminderModal() {
    this.showReminderModal = false;
  }

  saveReminderPreference() {
    const payload = {
      reminderEnabled: this.reminderEnabled,
      reminderTime: this.reminderTime,
    };

    this.diaryService.setReminder(payload).subscribe();
    this.toast.showSuccess('Reminder preference saved successfully');
  }

  logout() {
    this.auth.logout();
    this.toast.showSuccess('Logged out successfully');
    localStorage.removeItem('token');
  }
}
