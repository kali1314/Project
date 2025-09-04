import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {

  authService = inject(ApiService);
  router = inject(Router);
  toastr = inject(ToastrService);

  logInForm = new FormGroup({
    emailId: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  onLogIn() {
    this.authService.getUsers().subscribe({next: (users) => {
      if (!users || users.length === 0) {
        this.toastr.warning("No user found!!! Please Sign Up", "warning");
        this.router.navigate(['/sign-up']);
        return;
      }
      const isUserFoundEmail = users.find((m: any) => m.emailId === this.logInForm.value.emailId);
      if (!isUserFoundEmail) {
        this.toastr.warning("No user found registered with this email", "warning");
        this.router.navigate(['/sign-up']);
        return;
      } 
      const isUserFoundPassword= users.find((m: any) => m.password === this.logInForm.value.password);
      if (!isUserFoundPassword) {
        this.toastr.warning("Password is incorrect", "warning");
        return;
      }
      else {
        this.toastr.success("Log In successful!!!!", "Success");
        this.router.navigate(['/dashboard']);
      }
    }, error: (err) => {
      console.error("Error fetching users", err);
      this.toastr.error("Something went wrong. Please try again later.", "Error");
    }});
  }
}
