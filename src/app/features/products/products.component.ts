import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SeoService } from '../../core/services/seo.service';


@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly seoService = inject(SeoService);
  productslist: Product[] = [];
  pageSize!: number;
  p!: number;
  total!: number;

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'All Products',
      description: 'Browse our complete collection of quality products at LaCare. Find the best deals on electronics, fashion, home products and more.',
      keywords: 'all products, shop online, LaCare products, buy online Egypt, ecommerce',
      url: '/products'
    });

    this.getAllProductsData();
  }
  getAllProductsData(PageNumbuer: number = 1): void {
    this.productsService.getAllProducts(PageNumbuer).subscribe({


      next: (res) => {
        this.productslist = res.data;
        this.pageSize = res.metadata.limit;
        this.p = res.metadata.currentPage;
        this.total = res.results;
      },
      error: () => {},
    });

  }


}
