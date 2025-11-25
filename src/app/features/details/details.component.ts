import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from './services/proudect-details.service';
import { Product } from '../../core/models/product.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);
  id: string | null = null;
  productDetails: Product = {} as Product;
  ngOnInit(): void {
    this.getProductId();
    this.getProudectDatilsData();
  }

  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParams) => {
        this.id = (urlParams.get("id"));
      },
    });
  }
  getProudectDatilsData(): void {
    this.productDetailsService.getProudectDetails(this.id).subscribe({
      next: (res) => {
        console.log(res.data)
        this.productDetails = res.data;

      },
      error: (err) => {
        console.log(err)

      },
    })
  }
}
