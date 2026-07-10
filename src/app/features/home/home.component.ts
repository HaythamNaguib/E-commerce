import { Component, inject, OnInit } from '@angular/core';
import { MainSliderComponent } from "./components/main-slider/main-slider.component";
import { PopularProductsComponent } from "./components/popular-products/popular-products.component";
import { PopularCategoriesComponent } from "./components/popular-categories/popular-categories.component";
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  imports: [MainSliderComponent, PopularProductsComponent, PopularCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Home',
      description: 'LaCare - Your trusted destination for quality products at great prices. Shop electronics, fashion, home & more with fast delivery across Egypt.',
      keywords: 'online shopping, ecommerce, best deals, LaCare, Egypt, shop online, buy online',
      url: 'https://lacare.netlify.app/home'
    });

    this.seoService.addJsonLd(this.seoService.getOrganizationSchema());
    this.seoService.addJsonLd(this.seoService.getWebsiteSchema());
  }
}
