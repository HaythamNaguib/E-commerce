import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

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

    try {
      this.title.setTitle(fullTitle);
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ name: 'keywords', content: data.keywords ?? 'ecommerce, shop, online store, LaCare' });
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });

      this.meta.updateTag({ property: 'og:title', content: fullTitle });
      this.meta.updateTag({ property: 'og:description', content: data.description });
      this.meta.updateTag({ property: 'og:image', content: data.image ?? this.defaultImage });
      this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
      this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
      this.meta.updateTag({ name: 'twitter:image', content: data.image ?? this.defaultImage });
    } catch {
      // Silently fail during SSR
    }
  }

  addJsonLd(id: string, schema: object): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    } catch {
      // Silently fail
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
          : 'https://schema.org/OutOfStock'
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
      logo: this.defaultImage,
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
      potentialAction: {
        '@type': 'SearchAction',
        target: '/products',
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
