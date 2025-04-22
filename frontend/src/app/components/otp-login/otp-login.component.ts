import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ToastMessageComponent } from '../email-verification/toast-message/toast-message.component';
import { ToastService } from '../email-verification/toast-message/toast.service';

@Component({
  selector: 'app-otp-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,ToastMessageComponent],
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent {
  email = '';
  otp = '';
  step = 1;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router,private toast:ToastService) {}

  sendOtp() {
    this.loading = true;
    this.error = '';
    this.auth.requestOTP(this.email).subscribe({
      next: () => {
        this.step = 2;
        this.loading = false;
        this.toast.showSuccess('OTP sent successfully');
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send OTP';
        this.loading = false;
        this.toast.showError(this.error);
      }
    });
  }

  verifyOtp() {
    this.loading = true;
    this.error = '';
    this.auth.verifyOTP(this.email, this.otp).subscribe({
      next: (res) => {
        this.toast.showSuccess('OTP verified successfully');
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid OTP';
        this.loading = false;
        this.toast.showError(this.error); 
      }
    });
  }
}