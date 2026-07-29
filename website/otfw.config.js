import { defineDocsConfig } from '@opentf/web-docs/config';

export default defineDocsConfig({
  site: { url: 'https://js-std.opentechf.org' },

  docs: {
    title: 'JS Standard Library',
    version: 'v0.14.0',
    logo: '/assets/Logo.svg',
    homeUrl: '/',
    github: 'https://github.com/open-tech-foundation/js-std',
    repoUrl: 'https://github.com/open-tech-foundation/js-std',
    lastUpdated: true,
    nav: [
      { label: 'Home', href: '/' },
      { label: 'Playground', href: '/playground' },
    ],
    footer: {
      text: `MIT ${new Date().getFullYear()} © Open Tech Foundation`,
      links: [
        {
          label: 'Open Tech Foundation',
          href: 'https://opentechf.org',
          external: true,
        },
      ],
    },
    search: { provider: 'pagefind' },
  },
});
