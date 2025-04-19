import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.email, this.password).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      },
    });
  }
}