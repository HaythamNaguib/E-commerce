import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.seoService.updateMetaTags({
        title: 'Home',
        description: 'LaCare - Your trusted destination for quality products at great prices.',
        keywords: 'online shopping, ecommerce, best deals, LaCare, Egypt'
      });

      this.seoService.addJsonLd('organization-schema', this.seoService.getOrganizationSchema());
      this.seoService.addJsonLd('website-schema', this.seoService.getWebsiteSchema());
    } catch {}
  }
}
