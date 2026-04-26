import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

export default {
  useNextSeoProps() {
    return {
      titleTemplate: '%s – JS Standard Library',
    };
  },
  logo: (
    <>
      <img
        src="/assets/Logo.svg"
        width={35}
        height={35}
        alt="JS Standard Library Logo"
      />
      <span style={{ marginLeft: '.4em', fontWeight: 800 }}>
        JS Standard Library
      </span>
      <span
        style={{
          marginLeft: '.6em',
          fontSize: '0.7rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          opacity: 0.8,
          verticalAlign: 'middle',
          display: 'inline-flex',
          alignItems: 'center'
        }}
      >
        v1.0.0-beta.1
      </span>
    </>
  ),
  project: {
    link: 'https://github.com/open-tech-foundation/js-std',
  },
  docsRepositoryBase: 'https://github.com/open-tech-foundation/js-std',
  editLink: { component: null },
  head: () => {
    const { asPath } = useRouter();
    const { frontMatter } = useConfig();
    const url = `https://js-std.pages.dev/${asPath}`;

    return (
      <>
        <link rel="icon" href="/assets/Logo.svg" />
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content={frontMatter.title || 'JS Standard Library'}
        />
        <meta
          property="og:description"
          content={
            frontMatter.description ||
            'An Extensive JavaScript Standard Library.'
          }
        />
        <meta
          name="google-site-verification"
          content="1GsNBEYX2lcJpmj3OyKi6bszF9n3-Uv6bG_diPCpDhc"
        />
      </>
    );
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a
          href="https://open-tech-foundation.pages.dev/"
          target="_blank"
          rel="noreferrer"
        >
          Open Tech Foundation
        </a>
        .
      </span>
    ),
  },
};
