const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'ES Utils',
  tagline: 'A Collection of ECMAScript Utility Functions.',
  url: 'https://open-tech-world.github.io',
  baseUrl: '/es-utils/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'open-tech-world', // Usually your GitHub org/user name.
  projectName: 'es-utils', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '@open-tech-world/es-utils',
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/open-tech-world/es-utils',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Contributors of <a href="https://github.com/open-tech-world/es-utils">open-tech-world/es-utils</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
