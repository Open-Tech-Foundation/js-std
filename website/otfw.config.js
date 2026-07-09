import { defineDocsConfig } from '@opentf/web-docs/config';

export default defineDocsConfig({
  site: { url: 'https://js-std.pages.dev' },

  docs: {
    title: 'JS Standard Library',
    version: 'v1.0.0-beta.3',
    logo: '/assets/Logo.svg',
    homeUrl: '/docs',
    github: 'https://github.com/open-tech-foundation/js-std',
    repoUrl: 'https://github.com/open-tech-foundation/js-std',
    lastUpdated: true,
    nav: [
      { label: 'Docs', href: '/docs' },
      { label: 'Playground', href: '/docs/playground' },
    ],
    footer: {
      text: `MIT ${new Date().getFullYear()} © Open Tech Foundation`,
      links: [
        {
          label: 'Open Tech Foundation',
          href: 'https://open-tech-foundation.pages.dev/',
          external: true,
        },
      ],
    },
    search: { provider: 'pagefind' },
  },
});
