import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
isSignup: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}
  showLogin() {
    this.isSignup = false;
  }
  
  showSignup() {
    this.isSignup = true;
  }
  
  register() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}
