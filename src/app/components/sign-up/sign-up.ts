import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  signUpForm = new FormGroup({
    emailId: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  http = inject(HttpClient);
  router = inject(Router);
  toastr = inject(ToastrService);


  apiUrl: string = "https://my-json-api-i00y.onrender.com/users";


  onSignUp() {
    this.http.get<any[]>(this.apiUrl).subscribe({next: (user) => {
      const isUserFound = user.find((m: any) => m.emailId === this.signUpForm.value.emailId);
      if (isUserFound) {
        this.toastr.warning("Email Id already registered, please log in.", "Warning");
      }
      else {
        this.http.post(this.apiUrl, this.signUpForm.value).subscribe({next: () => {
          this.toastr.success("Registration Successful", "Success");
          this.router.navigate(['/log-in']);
        }, error: (err) => {
          console.log("Error saving user", err);
          this.toastr.error("Something went wrong in saving user", "Error");
        }})
      }
    }, error: (err) => {
      console.error("Error fetching users", err);
      this.toastr.error("Something went wrong. Please try again later.", "Error");
    }})
  }
}
