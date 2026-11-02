import BuiltWithBadge from './BuiltWithBadge.jsx';

const OTF_ORG = 'https://opentechf.org';

// Site footer: org link (logo + name) on the left, OTF Web badge on the right.
export default function SiteFooter() {
  return (
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="site-footer-org">
          <a
            href={OTF_ORG}
            target="_blank"
            rel="noreferrer"
            class="site-footer-org-link"
          >
            <img
              src="/assets/Logo.svg"
              alt=""
              width="24"
              height="24"
              class="site-footer-org-logo"
            />
            <span>© Open Tech Foundation</span>
          </a>
          <span class="site-footer-license">— MIT</span>
        </div>
        <BuiltWithBadge />
      </div>
    </footer>
  );
}
