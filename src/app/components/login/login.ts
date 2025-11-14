import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponseError, TokenPair } from '../../models/interfaces';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Login implements OnInit, OnDestroy {
  _isAuthenticated = false;
  showPassword = false;
  loginForm!: FormGroup;
  submitted = false;

  cards = [
    {
      title: 'Bénévolat',
      text: "Impliquez-vous dans des projets à impact social en offrant votre temps et vos compétences.",
      image: 'volunteering.png'
    },
    {
      title: 'Don',
      text: "Participez à l’impact positif en apportant un soutien financier, même modeste.",
      image: 'donation.png'
    },
    {
      title: 'Investissement',
      text: "Soutenez durablement les projets porteurs et contribuez à leur développement à long terme.",
      image: 'investment.png'
    }
  ];

  currentIndex = 0;
  intervalId: any;
  _isLoading = false;
  errorOccured = false;
  errorText = "";

  constructor(
    private router: Router, 
    private authenticationService: AuthService, 
    private formBuilder: FormBuilder, 
    private cdr: ChangeDetectorRef,
) {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated')
    this._isAuthenticated = isAuthenticatedString === 'true';
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide()
    }, 4000);
    if (this._isAuthenticated) {
      this.router.navigateByUrl("/home")
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.cdr.detach();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.cdr.detectChanges()
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.cdr.detectChanges()
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.submitted = true;
    if(this.loginForm.valid) {
      this._isLoading = true;
      this.cdr.detectChanges()
      this.authenticationService.login(
        {
          email: (this.loginForm.get('username')?.value as string).trim(),
          password: (this.loginForm.get('password')?.value as string).trim(),
          platform: "WEB_ADMIN"
        }
      ).subscribe({
        next: (response: TokenPair) => {
          localStorage.setItem("accessToken", response.accessToken)
          localStorage.setItem("refreshToken", response.refreshToken)
          localStorage.setItem("isAuthenticated", "true")
          this.router.navigateByUrl("/home")
          this._isLoading = false;
          this.cdr.detectChanges()
        },
        error: (error: ResponseError) => {
          this._isLoading = false;
          this.errorOccured = true;
          this.errorText = error.message;
          this.cdr.detectChanges()
          setTimeout(()=>{
            this.errorOccured = false;
            this.cdr.detectChanges();
          }, 5000)
        }
      })
    }
  }

  get isDisabled(): boolean {
    return this._isLoading;
  }
  
}
