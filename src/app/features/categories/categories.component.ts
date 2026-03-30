import { Product } from '../../core/models/product.interface';
import { Category } from './../../core/models/category.interface';
import { CategoriesService } from './../../core/services/categories/categories.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoriesList: Category[] = [];
  selectedCategory: Category | null = null;
  categoryProducts: Product[] = [];
  isLoading: boolean = false;
  productsLoading: boolean = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (res: { data: Category[] }) => {
        this.categoriesList = res.data ?? [];
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  selectCategory(category: Category): void {
    if (this.selectedCategory?._id === category._id) {
      this.clearSelection();
      return;
    }
    this.selectedCategory = category;
    this.loadCategoryProducts(category._id);
  }

  loadCategoryProducts(categoryId: string): void {
    this.productsLoading = true;
    this.categoryProducts = [];
    this.categoriesService.getCategoryProducts(categoryId).subscribe({
      next: (res: { data: Product[] }) => {
        this.categoryProducts = res.data ?? [];
        this.productsLoading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.productsLoading = false;
      }
    });
  }

  clearSelection(): void {
    this.selectedCategory = null;
    this.categoryProducts = [];
  }
}
