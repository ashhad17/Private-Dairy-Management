import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../email-verification/toast-message/toast.service';
import { ToastMessageComponent } from '../email-verification/toast-message/toast-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ToastMessageComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  login() {
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        
        this.toast.showSuccess('Login successful!');
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.toast.showError(err.error?.message || 'Login failed.');
        this.loading = false;
      },
    });
  }
}
