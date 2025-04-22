import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'toast-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss'],
})
export class ToastMessageComponent implements OnInit {
  visible = false;
  message = '';
  isError = false;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe(({ type, message }) => {
      this.message = message;
      this.isError = type === 'error';
      this.visible = true;
      setTimeout(() => this.visible = false, 3000);
    });
  }
}
