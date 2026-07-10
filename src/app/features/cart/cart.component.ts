import { CartService } from './../../core/services/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

interface CartItem {
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: { name: string };
  };
}

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly seoService = inject(SeoService);

  cartItems: CartItem[] = [];
  totalCartPrice: number = 0;
  isLoading: boolean = false;

  get totalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'My Cart',
      description: 'Review your shopping cart at LaCare. Check your selected items and proceed to checkout for fast delivery.',
      keywords: 'shopping cart, checkout, LaCare cart, buy online',
      url: 'https://lacare.netlify.app/cart'
    });

    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res: { data: { products: CartItem[]; totalCartPrice: number } }) => {
        this.cartItems = res.data?.products ?? [];
        this.totalCartPrice = res.data?.totalCartPrice ?? 0;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updateQuantity(productId: string, newCount: number): void {
    if (newCount < 1) return;
    this.cartService.updateCartItemCount(productId, newCount).subscribe({
      next: (res: { data: { products: CartItem[]; totalCartPrice: number } }) => {
        this.cartItems = res.data?.products ?? [];
        this.totalCartPrice = res.data?.totalCartPrice ?? 0;
      },
      error: (err: Error) => console.error(err)
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(productId).subscribe({
      next: (res: { data: { products: CartItem[]; totalCartPrice: number } }) => {
        this.cartItems = res.data?.products ?? [];
        this.totalCartPrice = res.data?.totalCartPrice ?? 0;
      },
      error: (err: Error) => console.error(err)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.totalCartPrice = 0;
      },
      error: (err: Error) => console.error(err)
    });
  }
}
