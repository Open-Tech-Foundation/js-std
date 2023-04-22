const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "JS Utils",
  tagline: "A Collection of JavaScript Utility Functions.",
  url: "https://open-tech-foundation.github.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  organizationName: "open-tech-foundation", // Usually your GitHub org/user name.
  projectName: "js-utils", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Utils",
      items: [
        { to: "/playground", label: "Playground", position: "right" },
        {
          href: "https://github.com/open-tech-foundation/js-utils",
          className: "header-github-link",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          html: `
          <div>
            Powered by
            <a href="https://open-tech-foundation.pages.dev/" target="_blank" rel="noreferrer noopener" aria-label="Built with docusaurus">
              <img style="vertical-align:middle" src="https://open-tech-foundation.pages.dev/img/Logo.svg" alt="Powered by open tech foundation" width="32" height="32" />
            </a>
            <span>-</span>
            Built with 
            <a href="https://docusaurus.io/" target="_blank" rel="noreferrer noopener" aria-label="Built with docusaurus">
            <img style="vertical-align:middle" src="https://d33wubrfki0l68.cloudfront.net/c088b7acfcf11100903c44fe44f2f2d7e0f30531/47727/img/docusaurus.svg" alt="Deploys by Cloudflare Pages" width="32" height="32" />
            </a>
            <span>-</span>
            Deploys by 
            <a href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Cloudflare Pages">
              <img style="vertical-align:middle" src="https://pages.cloudflare.com/resources/logo/logo.svg" alt="Deploys by Cloudflare Pages" width="32" height="32" />
            </a>
          </div>`,
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/open-tech-foundation">OPEN TECH FOUNDATION</a>.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-G91RSVFLZB",
          anonymizeIP: true,
        },
      },
    ],
  ],
};
