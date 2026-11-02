import { router } from '@opentf/afw';
import { Navbar } from '@opentf/afw-docs';
import config from '../afw.config.js';
import SiteFooter from './components/SiteFooter.jsx';

export const metadata = {
  titleTemplate: '%s — JS Standard Library',
  description:
    'An extensive JavaScript standard library — lightweight, high-accuracy, and runtime-agnostic.',
  openGraph: {
    siteName: 'JS Standard Library',
    locale: 'en_US',
    image: '/assets/Logo.png',
  },
  twitter: {
    // Square logo → compact card; summary_large_image wants ~2:1.
    card: 'summary',
    image: '/assets/Logo.png',
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://js-std.opentechf.org/#website',
        name: 'JS Standard Library',
        url: 'https://js-std.opentechf.org/',
        description:
          'An extensive JavaScript standard library — lightweight, high-accuracy, and runtime-agnostic.',
        inLanguage: 'en',
        publisher: { '@id': 'https://opentechf.org/#org' },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://js-std.opentechf.org/#software',
        name: '@opentf/std',
        alternateName: 'js-std',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Node.js, Bun, Deno, browsers, edge workers',
        url: 'https://js-std.opentechf.org/',
        downloadUrl: 'https://www.npmjs.com/package/@opentf/std',
        softwareHelp: 'https://js-std.opentechf.org/docs',
        codeRepository: 'https://github.com/Open-Tech-Foundation/js-std',
        programmingLanguage: 'JavaScript',
        license: 'https://opensource.org/licenses/MIT',
        description:
          'An extensive JavaScript standard library — lightweight, high-accuracy, and runtime-agnostic.',
        author: { '@id': 'https://opentechf.org/#org' },
        image: 'https://js-std.opentechf.org/assets/Logo.png',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'Organization',
        '@id': 'https://opentechf.org/#org',
        name: 'Open Tech Foundation',
        url: 'https://opentechf.org',
        logo: 'https://js-std.opentechf.org/assets/Logo.png',
        sameAs: ['https://github.com/Open-Tech-Foundation'],
      },
    ],
  },
};

export default function Layout(props) {
  $effect(() => {
    const path = router.pathname;
    let title = 'JS Standard Library';
    if (path === '/playground' || path.startsWith('/playground/')) {
      title = 'Playground — JS Standard Library';
    } else if (path.startsWith('/docs')) {
      const segs = path.split('/').filter(Boolean);
      const cat = segs[1];
      if (cat) {
        const map = {
          'env-support': 'Environment Support',
          security: 'Security',
          Flow: 'FlowControl',
        };
        const catLabel =
          map[cat] ??
          (cat.includes('-')
            ? cat
                .split('-')
                .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                .join(' ')
            : cat);
        const fn = segs[2];
        title = fn
          ? `${fn} — ${catLabel} — JS Standard Library`
          : `${catLabel} — JS Standard Library`;
      } else {
        title = 'Documentation — JS Standard Library';
      }
    }
    if (typeof document !== 'undefined') document.title = title;
  });

  return (
    <div class="afwd-shell">
      <Navbar config={config.docs} />
      <div class="afwd-shell-body">{props.children}</div>
      <SiteFooter />
    </div>
  );
}
