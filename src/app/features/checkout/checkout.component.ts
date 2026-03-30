import { CartService } from './../../core/services/cart.service';
import { CheckoutService } from './../../core/services/checkout.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface CartItem {
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
  };
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private readonly checkoutService = inject(CheckoutService);
  private readonly cartService = inject(CartService);
  private readonly fb = inject(FormBuilder);

  cartItems: CartItem[] = [];
  totalCartPrice: number = 0;
  cartId: string = '';

  paymentMethod: 'cash' | 'online' = 'cash';
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  checkoutForm = this.fb.group({
    details: [null, [Validators.required, Validators.minLength(5)]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res: { data: { _id: string; products: CartItem[]; totalCartPrice: number } }) => {
        this.cartId = res.data._id;
        this.cartItems = res.data.products ?? [];
        this.totalCartPrice = res.data.totalCartPrice ?? 0;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';
    this.successMsg = '';

    const shippingAddress = this.checkoutForm.value;

    if (this.paymentMethod === 'cash') {
      this.checkoutService.cashOrder(this.cartId, shippingAddress).subscribe({
        next: () => {
          this.successMsg = '✅ Order placed successfully!';
          this.isSubmitting = false;
          this.checkoutForm.reset();
        },
        error: (err: { error: { message: string } }) => {
          this.errorMsg = err.error?.message ?? 'Something went wrong.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.checkoutService.onlineOrder(this.cartId, shippingAddress).subscribe({
        next: (res: { session: { url: string } }) => {
          this.isSubmitting = false;
          window.location.href = res.session.url;
        },
        error: (err: { error: { message: string } }) => {
          this.errorMsg = err.error?.message ?? 'Something went wrong.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
