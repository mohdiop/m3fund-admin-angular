import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminResponse, ResponseError } from '../../models/interfaces';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  _isAuthenticated = false;
  userInfo: AdminResponse|null = null

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated')
    this._isAuthenticated = isAuthenticatedString === 'true';
  }
  ngOnInit(): void {
    if (!this._isAuthenticated) {
      this.router.navigateByUrl("/login")
    }
    this.userService.me()
      .subscribe({
        next: (user: AdminResponse) => {
          this.userInfo = user;
          this.cdr.detectChanges()
        },
        error: (error: ResponseError) => {
          console.log(error.message)
        }
      })
  }
}
