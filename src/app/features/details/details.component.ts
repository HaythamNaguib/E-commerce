import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetailsService } from './services/proudect-details.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { Product } from '../../core/models/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly cartService = inject(CartService);
  private readonly seoService = inject(SeoService);

  id: string | null = null;
  productDetails: Product = {} as Product;
  selectedImage: string = '';
  isAdding = signal(false);
  added = signal(false);
  isLoading = signal(true);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParams) => {
        this.id = urlParams.get('id');
        if (this.id) {
          this.loadProduct();
        }
      },
    });
  }

  loadProduct(): void {
    if (!this.id) return;
    this.isLoading.set(true);
    this.productDetailsService.getProudectDetails(this.id).subscribe({
      next: (res) => {
        this.productDetails = res.data;
        this.selectedImage = res.data.imageCover;
        this.isLoading.set(false);

        this.seoService.updateMetaTags({
          title: res.data.title,
          description: res.data.description?.substring(0, 160) ?? `${res.data.title} - Buy now at LaCare`,
          keywords: `${res.data.title}, ${res.data.category?.name}, LaCare, buy online`,
          image: res.data.imageCover,
          type: 'product',
          url: `https://lacare.netlify.app/details/${res.data.slug}/${res.data._id}`
        });

        this.seoService.addJsonLd(this.seoService.getProductSchema(res.data));

        this.seoService.addJsonLd(this.seoService.getBreadcrumbSchema([
          { name: 'Home', url: 'https://lacare.netlify.app/home' },
          { name: 'Products', url: 'https://lacare.netlify.app/products' },
          { name: res.data.title, url: `https://lacare.netlify.app/details/${res.data.slug}/${res.data._id}` }
        ]));
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  addToCart(): void {
    if (!this.productDetails._id) return;
    this.isAdding.set(true);
    this.cartService.addToCart(this.productDetails._id).subscribe({
      next: () => {
        this.isAdding.set(false);
        this.added.set(true);
        setTimeout(() => this.added.set(false), 2000);
      },
      error: () => {
        this.isAdding.set(false);
      }
    });
  }
}
