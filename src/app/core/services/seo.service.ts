import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment.development';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly siteName = 'LaCare';
  private readonly defaultImage = '/images/ms-1.avif';

  updateMetaTags(data: SeoData): void {
    const fullTitle = data.title === this.siteName
      ? data.title
      : `${data.title} | ${this.siteName}`;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'keywords', content: data.keywords ?? 'ecommerce, shop, online store, LaCare' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:image', content: data.image ?? this.defaultImage });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: data.image ?? this.defaultImage });

    // Canonical
    if (isPlatformBrowser(this.platformId)) {
      const url = data.url ?? window.location.href;
      this.updateCanonical(url);
    }
  }

  private updateCanonical(url: string): void {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', url);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }

  addJsonLd(schema: object): void {
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }

  removeJsonLd(): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = document.getElementById('json-ld-schema');
      if (script) script.remove();
    }
  }

  getProductSchema(product: any): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.imageCover,
      brand: {
        '@type': 'Brand',
        name: product.brand?.name ?? 'LaCare'
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EGP',
        price: product.price,
        availability: (product.quantity ?? 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: isPlatformBrowser(this.platformId) ? window.location.href : ''
      },
      aggregateRating: product.ratingsAverage ? {
        '@type': 'AggregateRating',
        ratingValue: product.ratingsAverage,
        reviewCount: product.sold ?? 1
      } : undefined
    };
  }

  getOrganizationSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      url: environment.baseUrl,
      logo: '/images/ms-1.avif',
      sameAs: [
        'https://www.facebook.com/share/1CdLkTNkiN/',
        'https://www.linkedin.com/in/haytham-mohamed-nagiub-614620193'
      ]
    };
  }

  getWebsiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: environment.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: environment.baseUrl + 'products?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
  }

  getBreadcrumbSchema(items: { name: string; url: string }[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }
}
