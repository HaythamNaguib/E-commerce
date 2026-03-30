import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
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

  ngOnInit(): void {
    this.initFlowbiteOnLoad();

    // إعادة تشغيل Flowbite بعد كل navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initFlowbiteOnLoad();
    });
  }

  private initFlowbiteOnLoad(): void {
    this.flowbiteService.loadFlowbite(() => {
      setTimeout(() => initFlowbite(), 100);
    });
  }

  signOut(): void {
    this.authService.logout();
  }
}
