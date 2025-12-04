import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9_$]{6,}$/)
    ]),
    rePassword: new FormControl(null, [
      Validators.required
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ])
  }, { validators: this.passwordMatchValidator() });

  // Custom validator للتحقق من تطابق الباسوورد
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const rePassword = control.get('rePassword');

      if (!password || !rePassword) {
        return null;
      }

      return password.value === rePassword.value ? null : { passwordMismatch: true };
    };
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // هنا تقدر تبعت الداتا للـ API
      // Example:
      // this.authService.register(this.registerForm.value).subscribe(...)
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
