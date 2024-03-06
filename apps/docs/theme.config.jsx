import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default {
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Utils",
    };
  },
  logo: (
    <>
      <img src="/assets/Logo.svg" width={35} height={35} />
      <span style={{ marginLeft: ".4em", fontWeight: 800 }}>Utils</span>
    </>
  ),
  project: {
    link: "https://github.com/open-tech-foundation/js-utils",
  },
  docsRepositoryBase:
    "https://github.com/open-tech-foundation/js-utils/app/docs",
  head: () => {
    const { asPath } = useRouter();
    const { frontMatter } = useConfig();
    const url = "https://js-utils.pages.dev/" + asPath;

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || "Utils"} />
        <meta
          property="og:description"
          content={
            frontMatter.description ||
            "A collection of JavaScript utility functions."
          }
        />
        <meta name="google-site-verification" content="1GsNBEYX2lcJpmj3OyKi6bszF9n3-Uv6bG_diPCpDhc" />
      </>
    );
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://open-tech-foundation.pages.dev/" target="_blank">
          Open Tech Foundation
        </a>
        .
      </span>
    ),
  },
};
