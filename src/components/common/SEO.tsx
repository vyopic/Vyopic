import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  schemaType?: string;
  schemaData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  schemaType = 'WebApplication',
  schemaData
}) => {
  const location = useLocation();
  const currentUrl = canonicalUrl || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Document Title
    document.title = title;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Meta Keywords
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // OpenGraph Meta
    const ogTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:url': currentUrl,
      'og:type': 'website',
      'og:site_name': 'Vyopic',
      'twitter:title': title,
      'twitter:description': description
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        if (property.startsWith('og:')) {
          ogMeta.setAttribute('property', property);
        } else {
          ogMeta.setAttribute('name', property);
        }
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', content);
    });

    // Schema.org JSON-LD
    const schemaId = 'vyopic-jsonld-schema';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const jsonLd = schemaData || {
      '@context': 'https://schema.org',
      '@type': schemaType,
      'name': title.split('–')[0].trim(),
      'url': currentUrl,
      'description': description,
      'applicationCategory': 'MultimediaApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires HTML5 Canvas support',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    };

    schemaScript.text = JSON.stringify(jsonLd);

  }, [title, description, keywords, currentUrl, schemaType, schemaData]);

  return null;
};
