import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [NgIf, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})

export class NavBar {
  @Input() page: 'home' | 'initial_home'= 'initial_home';

  router = inject(Router);

  onLogIn() {
    this.router.navigate(['/log-in']);
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }

  onLogOut() {
    this.router.navigate(['/init-home']);
  }
}
