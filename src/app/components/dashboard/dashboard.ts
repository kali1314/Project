import { Component } from '@angular/core';
import { NavBar } from "../shared/nav-bar/nav-bar";

@Component({
  selector: 'app-dashboard',
  imports: [ NavBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
