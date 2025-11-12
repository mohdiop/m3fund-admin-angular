import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  _isAuthenticated = false;

  constructor(private router: Router) {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated')
    this._isAuthenticated = isAuthenticatedString === 'true';
  }
  ngOnInit(): void {
    if (!this._isAuthenticated) {
      this.router.navigateByUrl("/login")
    }
  }
}
