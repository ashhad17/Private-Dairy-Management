import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports:[CommonModule,FormsModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
    localStorage.removeItem('token');
  }
}
