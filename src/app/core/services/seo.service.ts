import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

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
  private readonly siteUrl = environment.siteUrl;
  private readonly defaultImage = '/images/ms-1.avif';

  private toAbsoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${this.siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  updateMetaTags(data: SeoData): void {
    const fullTitle = data.title === this.siteName
      ? data.title
      : `${data.title} | ${this.siteName}`;

    const imageUrl = this.toAbsoluteUrl(data.image ?? this.defaultImage);
    const pageUrl = data.url
      ? this.toAbsoluteUrl(data.url)
      : this.siteUrl;

    try {
      this.title.setTitle(fullTitle);
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ name: 'keywords', content: data.keywords ?? 'ecommerce, shop, online store, LaCare' });
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });

      this.meta.updateTag({ property: 'og:title', content: fullTitle });
      this.meta.updateTag({ property: 'og:description', content: data.description });
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'og:url', content: pageUrl });
      this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
      this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
      this.meta.updateTag({ property: 'og:locale', content: 'en_US' });

      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

      if (isPlatformBrowser(this.platformId)) {
        let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', pageUrl);
      }
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
      image: this.toAbsoluteUrl(product.imageCover),
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
      url: this.siteUrl,
      logo: this.toAbsoluteUrl(this.defaultImage),
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
      url: this.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.siteUrl}/products`,
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
        item: this.toAbsoluteUrl(item.url)
      }))
    };
  }
}
