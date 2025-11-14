import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminResponse, ResponseError } from '../../models/interfaces';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  _isAuthenticated = false;
  userInfo: AdminResponse|null = null
  selectedMenu = 0
  showLogoutDialog = false;

  menuMenus = [
    {
      title: "Dashboard",
      icon: "ri-dashboard-line",
      selectedIcon: "ri-dashboard-fill"
    },
    {
      title: "Utilisateurs",
      icon: "ri-user-line",
      selectedIcon: "ri-user-fill"
    },
    {
      title: "Administrateurs",
      icon: "ri-user-star-line",
      selectedIcon: "ri-user-star-fill"
    },
    {
      title: "Projets",
      icon: "ri-folder-chart-line",
      selectedIcon: "ri-folder-chart-fill"
    },
    {
      title: "Paiements",
      icon: "ri-bank-card-line",
      selectedIcon: "ri-bank-card-fill"
    },
    {
      title: "Historiques",
      icon: "ri-history-line",
      selectedIcon: "ri-history-fill"
    },
  ]

  generalMenus = [
    {
      title: "Paramètres",
      icon: "ri-settings-5-line",
      selectedIcon: "ri-settings-5-fill"
    },
    {
      title: "Aide",
      icon: "ri-question-line",
      selectedIcon: "ri-question-fill"
    },
    {
      title: "Déconnexion",
      icon: "ri-logout-circle-line",
      selectedIcon: "ri-logout-circle-fill"
    }
  ]

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
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

  selectMenu(i: number) {
    if(i === 8) {
      this.openLogoutDialog()
    } else {
      this.selectedMenu = i;
      this.cdr.detectChanges()
    }
  }

  openLogoutDialog() {
    this.showLogoutDialog = true;
    this.cdr.detectChanges()
  }

  closeDialog() {
    this.showLogoutDialog = false;
    this.cdr.detectChanges()
  }

  logout() {
    this.showLogoutDialog = false;
    this.authService.logout()
    this.router.navigateByUrl("/login")
    this.cdr.detectChanges()
  }
}
