import { Component, EventEmitter, Output } from '@angular/core';
import { DiaryService } from '../diary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-entry',
  templateUrl: './modal-entry.component.html',
  imports:[CommonModule,FormsModule],
  styleUrls: ['./modal-entry.component.scss']
})
export class ModalEntryComponent {
  isModalOpen = false;
  isEdit = false;
  entry = {_id:'', title: '', content: '', tags: '', mood: 'happy' };

  @Output() entryCreated = new EventEmitter();

  constructor(private diaryService: DiaryService) {}

  openModal(entry: any = null): void {
    this.isModalOpen = true;
    this.isEdit = entry ? true : false;
    this.entry = entry || { title: '', content: '', tags: '', mood: 'happy' };
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.entry = {_id:'', title: '', content: '', tags: '', mood: 'happy' }; // Reset entry data
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.diaryService.updateEntry(this.entry._id, this.entry).subscribe(() => {
        this.entryCreated.emit();
        this.closeModal();
      });
    } else {
      this.diaryService.createEntry(this.entry).subscribe(() => {
        this.entryCreated.emit();
        this.closeModal();
      });
    }
  }
}
