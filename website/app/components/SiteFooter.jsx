import BuiltWithBadge from './BuiltWithBadge.jsx';

const OTF_ORG = 'https://opentechf.org';

// Site footer: org link (logo + name) on the left, OTF Web badge on the right.
export default function SiteFooter() {
  return (
    <footer class="otfw-footer">
      <div class="otfw-footer-inner">
        <div class="otfw-footer-org">
          <a
            href={OTF_ORG}
            target="_blank"
            rel="noreferrer"
            class="otfw-footer-org-link"
          >
            <img
              src="/assets/Logo.svg"
              alt=""
              width="24"
              height="24"
              class="otfw-footer-org-logo"
            />
            <span>© Open Tech Foundation</span>
          </a>
          <span class="otfw-footer-license">— MIT</span>
        </div>
        <BuiltWithBadge />
      </div>
    </footer>
  );
}
