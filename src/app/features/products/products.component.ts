import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService)
  productslist: Product[] = [];
  pageSize!: number;
  p!: number;
  total!: number;

  ngOnInit(): void {
    this.getAllProductsData();
  }
  getAllProductsData(PageNumbuer: number = 1): void {
    this.productsService.getAllProducts(PageNumbuer).subscribe({


      next: (res) => {
        console.log(res.data);

        this.productslist = res.data;
        this.pageSize = res.metadata.limit;
        this.p = res.metadata.currentPage;
        this.total = res.results;

      },

      error: (err) => {
        console.log(err)

      },
    });

  }


}
