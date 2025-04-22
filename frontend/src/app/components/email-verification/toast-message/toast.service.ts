import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ type: 'success' | 'error', message: string }>();
  toastState$ = this.toastSubject.asObservable();

  showSuccess(message: string) {
    this.toastSubject.next({ type: 'success', message });
  }

  showError(message: string) {
    this.toastSubject.next({ type: 'error', message });
  }
}
