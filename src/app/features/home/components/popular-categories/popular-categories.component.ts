import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from './../../../../core/services/categories/categories.service';
import { Category } from '../../../../core/models/category.interface';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { log } from 'console';

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [CarouselModule, CommonModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css'
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoriesList: Category[] = [];

  categoriesOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1100: {
        items: 6,
      },
    },
    nav: false,
  };

  ngOnInit(): void {
    console.log("inside .....................");

    this.getAllCategoriesData();
  }


  getAllCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res: any) => {
        console.log('Categories API Response:', res);
        console.log('Categories data:', res.data);

        if (res && res.data) {
          this.categoriesList = res.data;
          console.log('Categories list length:', this.categoriesList.length);
        }
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
      }
    });
  }
}
