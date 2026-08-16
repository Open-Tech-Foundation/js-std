import { router } from '@opentf/web';
import { Navbar } from '@opentf/web-docs';
import config from '../otfw.config.js';
import SiteFooter from './components/SiteFooter.jsx';

export const metadata = {
  titleTemplate: '%s — JS Standard Library',
  description:
    'An extensive JavaScript standard library — lightweight, high-accuracy, and runtime-agnostic.',
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
        title = fn ? `${fn} — ${catLabel} — JS Standard Library` : `${catLabel} — JS Standard Library`;
      } else {
        title = 'Documentation — JS Standard Library';
      }
    }
    if (typeof document !== 'undefined') document.title = title;
  });

  return (
    <div class="otfw-shell">
      <Navbar config={config.docs} />
      <div class="otfw-shell-body">{props.children}</div>
      <SiteFooter />
    </div>
  );
}
