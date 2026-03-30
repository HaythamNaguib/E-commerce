import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private subscription: Subscription = new Subscription();

  masError: string = '';
  isLoading: boolean = false;

  registerForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[\w@$!%*?&]{6,}$/)]],
    rePassword: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, {
    validators: this.confirmPassword
  });

  ngOnInit(): void { }

  confirmPassword(group: AbstractControl) {
    if (group.get('password')?.value === group.get('rePassword')?.value) {
      return null;
    }
    group.get('rePassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.masError = '';

    this.subscription = this.authService.registerForm(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.message === 'success') {
          this.router.navigate(['/login']);
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
