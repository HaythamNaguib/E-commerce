import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  masError: string = '';
  isLoading: boolean = false;

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[\w@$!%*?&]{6,}$/)]],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.isLoading = true;
      this.authService.loginForm(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === "success") {
            setTimeout(() => {
              this.masError = '';
              this.router.navigate(['/home']);
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
}
