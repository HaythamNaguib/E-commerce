import { Component, inject, OnInit } from '@angular/core';
import { Brand, Product } from '../../core/models/product.interface';
import { BrandsService } from '../../core/services/brand.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-brands',
  imports: [CardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly seoService = inject(SeoService);

  brandsList: Brand[] = [];
  selectedBrand: Brand | null = null;
  brandProducts: Product[] = [];

  isLoading: boolean = false;
  productsLoading: boolean = false;

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'All Brands',
      description: 'Explore top brands at LaCare. Find your favorite brands and shop quality products with great prices.',
      keywords: 'brands, top brands, LaCare brands, shop by brand',
      url: '/brands'
    });

    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.brandsService.getAllBrands().subscribe({
      next: (res: { data: Brand[] }) => {
        this.brandsList = res.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectBrand(brand: Brand): void {
    if (this.selectedBrand?._id === brand._id) {
      this.clearSelection();
      return;
    }
    this.selectedBrand = brand;
    this.loadBrandProducts(brand._id);
  }

  loadBrandProducts(brandId: string): void {
    this.productsLoading = true;
    this.brandProducts = [];
    this.brandsService.getBrandProducts(brandId).subscribe({
      next: (res: { data: Product[] }) => {
        this.brandProducts = res.data ?? [];
        this.productsLoading = false;
      },
      error: () => {
        this.productsLoading = false;
      }
    });
  }

  clearSelection(): void {
    this.selectedBrand = null;
    this.brandProducts = [];
  }
}
