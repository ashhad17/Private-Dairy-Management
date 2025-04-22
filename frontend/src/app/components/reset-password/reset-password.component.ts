import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastMessageComponent } from '../email-verification/toast-message/toast-message.component';
import { ToastService } from '../email-verification/toast-message/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule,CommonModule,ToastMessageComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password = '';
  loading = false;
  success = '';
  error = '';
  token: string = '';

  constructor(private route: ActivatedRoute,private toast:ToastService, private auth: AuthService, private router: Router) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.toast.showSuccess('Password reset successful!');
        this.success = 'Password reset successful!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.toast.showError(err.error?.message || 'Reset failed');
        this.error = err.error?.message || 'Reset failed';
        this.loading = false;
      }
    });
  }
}