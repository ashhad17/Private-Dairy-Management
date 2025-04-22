import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../email-verification/toast-message/toast.service';
import { ToastMessageComponent } from '../email-verification/toast-message/toast-message.component';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,ToastMessageComponent],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {
  isSignup: boolean = false;

  // Shared
  loading: boolean = false;
  error: string = '';

  // Login form
  email: string = '';
  password: string = '';

  // Signup form
  name: string = '';

  constructor(private auth: AuthService, private router: Router,private toast:ToastService) {}

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.toast.showSuccess('Login successful');
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed.';
        this.loading = false;
        this.toast.showError(err.error?.message);
      }
    });
  }

  register() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.toast.showSuccess('Registration successful. Please check your email for verification.');
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
        
        this.toast.showError(err.error?.message);
      }
    });
  }
}
