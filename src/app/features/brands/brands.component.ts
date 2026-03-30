import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand, Product } from '../../core/models/product.interface';
import { BrandsService } from '../../core/services/brand.service';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  brandsList: Brand[] = [];
  selectedBrand: Brand | null = null;
  brandProducts: Product[] = [];

  isLoading: boolean = false;
  productsLoading: boolean = false;

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.brandsService.getAllBrands().subscribe({
      next: (res: { data: Brand[] }) => {
        this.brandsList = res.data ?? [];
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
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
      error: (err: Error) => {
        console.error(err);
        this.productsLoading = false;
      }
    });
  }

  clearSelection(): void {
    this.selectedBrand = null;
    this.brandProducts = [];
  }
}
