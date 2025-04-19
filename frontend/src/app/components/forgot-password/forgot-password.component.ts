import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,FormsModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';
  error = '';

  constructor(private auth: AuthService) {}

  submit() {
    this.loading = true;
    this.message = '';
    this.error = '';
    this.auth.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.message = 'Reset link sent. Please check your email.';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send reset link.';
        this.loading = false;
      }
    });
  }
}