import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  isMobileMenuOpen = signal(false);
  cartCount = signal(0);

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMobileMenuOpen.set(false);
    });

    if (this.authService.isLoggedIn()) {
      this.cartService.refreshCartCount();
    }

    this.cartService.cartCount.subscribe(count => {
      this.cartCount.set(count);
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  signOut(): void {
    this.authService.logout();
    this.cartCount.set(0);
  }
}
