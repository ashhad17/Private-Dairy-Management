
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  token: string = '';
  message: string = '';
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  verifyEmail(): void {
    if (this.token) {
      this.authService.verifyEmail(this.token).subscribe(
        (response) => {
          this.toastr.success('Email verified successfully!');
          setTimeout(() => this.router.navigate(['/login']), 2000);  // Optional: Redirect after success
        },
        (error) => {
          this.toastr.error('Invalid or expired verification link.');
        }
      );
    } else {
      this.toastr.error('Verification token is missing.');
    }
  }
}

