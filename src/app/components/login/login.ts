import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  _isAuthenticated = false;
  showPassword = false;

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

  constructor(private router: Router) {
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
  }
  
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

  }
  
}
