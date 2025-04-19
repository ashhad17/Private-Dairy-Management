
// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed.';
        this.loading = false;
      },
    });
  }
}
