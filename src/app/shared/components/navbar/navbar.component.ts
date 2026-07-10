import { Component, inject, OnInit, signal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
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
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  isMobileMenuOpen = signal(false);
  cartCount = signal(0);

  ngOnInit(): void {
    this.initFlowbiteOnLoad();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initFlowbiteOnLoad();
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

  private initFlowbiteOnLoad(): void {
    this.flowbiteService.loadFlowbite(() => {
      setTimeout(() => initFlowbite(), 100);
    });
  }

  signOut(): void {
    this.authService.logout();
    this.cartCount.set(0);
  }
}
