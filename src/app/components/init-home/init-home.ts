import { Component, inject } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-init-home',
  imports: [],
  templateUrl: './init-home.html',
  styleUrl: './init-home.css'
})
export class InitHome {

  router = inject(Router);
  
  onLogIn() {
    this.router.navigate(['/log-in']);
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
