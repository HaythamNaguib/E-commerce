import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private subscription: Subscription = new Subscription();

  isLoading: boolean = false;
  masError: string = '';

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[\w@$!%*?&]{6,}$/)]],
  });

  ngOnInit(): void { }

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.masError = '';

    this.subscription = this.authService.loginForm(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.message === 'success') {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.masError = err.error?.message ?? 'Something went wrong.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
