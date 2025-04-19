import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { OtpLoginComponent } from './components/otp-login/otp-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './diary/home/home.component';
import { DiaryViewComponent } from './diary-view/diary-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'dashboard',component:HomeComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'verify-email/:token', component: EmailVerificationComponent },
  { path: 'otp-login', component: OtpLoginComponent },
  { path: 'diary/:id', component: DiaryViewComponent },
];
