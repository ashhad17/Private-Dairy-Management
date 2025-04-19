import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  imports:[CommonModule,FormsModule,HeaderComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  loading = false;
  userData: any;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http.get('http://localhost:5000/auth/protected').subscribe({
      next: (res: any) => {
        this.userData = res;
        console.log(this.userData);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load user data.';
        this.loading = false;
      },
    });
  }
}
