import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastMessageComponent } from './components/email-verification/toast-message/toast-message.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
