import { Routes } from '@angular/router';
import { InitHome } from './components/init-home/init-home';
import { LogIn } from './components/log-in/log-in';
import { SignUp } from './components/sign-up/sign-up';
import { Dashboard } from './components/dashboard/dashboard';
import { Teacher } from './components/teacher/teacher';
import { Student } from './components/student/student';

export const routes: Routes = [
  {
    path: '',
    component: InitHome,
    pathMatch: 'full'
  },
  {
    path: 'log-in',
    component: LogIn
  },
  {
    path: 'sign-up',
    component: SignUp
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'teacher',
    component: Teacher
  },
  {
    path: 'student',
    component: Student
  },
  {
    path: '**',
    redirectTo: '' // unknown routes redirect to this Initial Home page.
  }
];
