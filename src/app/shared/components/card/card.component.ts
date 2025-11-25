import { Product } from './../../../core/models/product.interface';
import { Component, Input, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  onAdd() {
    throw new Error('Method not implemented.');
  }
  @Input({ required: true }) product!: Product;

}
