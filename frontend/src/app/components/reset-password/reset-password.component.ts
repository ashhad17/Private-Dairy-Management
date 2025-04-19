import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password = '';
  loading = false;
  success = '';
  error = '';
  token: string = '';

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.success = 'Password reset successful!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Reset failed';
        this.loading = false;
      }
    });
  }
}