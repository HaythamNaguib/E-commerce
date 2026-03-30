import { CartService } from './../../../core/services/cart.service';
import { Product } from './../../../core/models/product.interface';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  private readonly cartService = inject(CartService);

  @Input({ required: true }) product!: Product;

  isAdding: boolean = false;
  added: boolean = false;

  addToCart(productId: string): void {
    this.isAdding = true;
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.isAdding = false;
        this.added = true;
        setTimeout(() => this.added = false, 2000);
      },
      error: (err: Error) => {
        console.error(err);
        this.isAdding = false;
      }
    });
  }
}
