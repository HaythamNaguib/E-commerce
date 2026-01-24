import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  masError: string = '';
  isLoading: boolean = false;

  registerForm = this.fb.group({
    name: [null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[\w@$!%*?&]{6,}$/)]],
    rePassword: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, {
    validators: this.confirmPassword
  });

  confirmPassword(group: AbstractControl) {
    return group.get('password')?.value === group.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }

  submitForm(): void {
    if (this.registerForm.valid) {
    } else {
      // show all errors
      this.registerForm.setErrors({ mismatch: true });
      this.registerForm.get('rePassword')?.patchValue(null);
      this.registerForm.markAllAsTouched();
    };

    console.log(this.registerForm.value);
    this.isLoading = true;

    this.authService.registerForm(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.message === "success") {
          setTimeout(() => {
            this.masError = '';
            this.router.navigate(['/login']);
          }, 1000);
        }
        this.isLoading = false;

      },
      error: (err) => {
        console.log(err);
        this.masError = err.error.message;
        this.isLoading = false;
      }
    })
  }
}

