import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  flag: boolean = true;
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

  ngOnInit(): void {

  }

  confirmPassword(group: AbstractControl) {
    if (group.get('password')?.value === group.get('rePassword')?.value) {
      return null;
    }
    else {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
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
