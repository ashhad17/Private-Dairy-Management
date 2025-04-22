import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from './toast-message/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastMessageComponent } from './toast-message/toast-message.component';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastMessageComponent],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  token: string = '';
  message: string = '';
  err: string = '';
  loading: boolean = false; // ✅ Add this line
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  verifyEmail(): void {
    if (this.token) {
      this.loading = true; 
      this.authService.verifyEmail(this.token).subscribe({
        next: () => {
          this.message = 'Email verified successfully!';
          this.loading = false; // ✅ Stop loading
          this.toast.showSuccess(this.message);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.err = 'Invalid or expired verification link.';
          this.loading = false; // ✅ Stop loading
          this.toast.showError(this.err);
        }
      });
    } else {
      this.toast.showError('Verification token is missing.');
    }
  }
}
