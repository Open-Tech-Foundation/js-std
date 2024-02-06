// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
import { themes } from "prism-react-renderer";
import { themes as prismThemes } from "prism-react-renderer";

const orgName = "open-tech-foundation";
const repoName = "js-utils";
const pkgVer = require(`../../packages/utils/package.json`).version;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Utils",
  tagline: "A Collection of JavaScript Utility Functions.",
  url: "https://js-utils.pages.dev/",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/Logo.svg",
  organizationName: orgName, // Usually your GitHub org/user name.
  projectName: repoName, // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          // Please change this to your repo.
          editUrl: `https://github.com/${orgName}/${repoName}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Utils",
        logo: {
          alt: "Logo",
          src: "img/Logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Docs",
          },
          {
            label: "Playground",
            position: "left",
            to: "/playground",
          },
          {
            html: `<div style="display: flex; align-items: center"><span>v.${pkgVer}</span><img style="margin-left: 8px" src="/img/Npm-logo.svg" width="48" height="32" /></div>`,
            position: "right",
            href: `https://www.npmjs.com/package/@opentf/utils`,
            className: "npm-link",
          },
          {
            href: `https://github.com/${orgName}/${repoName}`,
            className: "header-github-link",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            html: `<a href="https://docusaurus.io/">📝 Built with Docusaurus.</a>`,
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://open-tech-foundation.pages.dev">Open Tech Foundation</a>.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
