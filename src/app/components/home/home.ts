import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AdminResponse, ResponseError } from '../../models/interfaces';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  _isAuthenticated = false;
  userInfo: AdminResponse|null = null
  selectedMenu = 0
  showLogoutDialog = false;
  private sub!: Subscription;

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
    this.selectMenu(this.selectedMenu)
    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        switch(event.urlAfterRedirects) {
          case "/home/dashboard": {
            this.selectedMenu = 0;
            break;
          }
          case "/home/users": {
            this.selectedMenu = 1;
            break;
          }
          case "/home/administrators": {
            this.selectedMenu = 2;
            break;
          }
          case "/home/projects": {
            this.selectedMenu = 3;
            break;
          }
          case "/home/payments": {
            this.selectedMenu = 4;
            break;
          }
          case "/home/histories": {
            this.selectedMenu = 5;
            break;
          }
          case "/home/settings": {
            this.selectedMenu = 6;
            break;
          }
          case "/home/help": {
            this.selectedMenu = 7;
            break;
          }
          default: this.selectedMenu = 0;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  selectMenu(i: number) {
    if(i === 8) {
      this.openLogoutDialog()
    } else {
      this.selectedMenu = i;
      this.cdr.detectChanges()
      switch(i) {
        case 0: {
          this.router.navigateByUrl("/home/dashboard")
          break;
        }
        case 1: {
          this.router.navigateByUrl("/home/users")
          break
        }
        case 2: {
          this.router.navigateByUrl("/home/administrators")
          break
        }
        case 3: {
          this.router.navigateByUrl("/home/projects")
          break
        }
        case 4: {
          this.router.navigateByUrl("/home/payments")
          break
        }
        case 5: {
          this.router.navigateByUrl("/home/histories")
          break
        }
        case 6: {
          this.router.navigateByUrl("/home/settings")
          break
        }
        case 7: {
          this.router.navigateByUrl("/home/help")
          break
        }
        default: {
          this.router.navigateByUrl("/home")
          break
        }
      }
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
