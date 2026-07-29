import { DocsLayout } from '@opentf/web-docs';
import navMap from '@opentf/web-docs/nav';
import config from '../otfw.config.js';
import Intro from './components/Intro.mdx';

/**
 * The landing page renders the docs Introduction directly, rather than
 * redirecting to /docs.
 *
 * The generated nav is a section map keyed by top-level folder, so it has no
 * "/" entry and `DocsLayout` cannot resolve a section for this route on its
 * own. Passing the "/docs" tree as a bare array selects it explicitly — the
 * documented override, and what the layout treats as a single unscoped section.
 */
export default function Home() {
  return (
    <DocsLayout config={config.docs} frame={false} nav={navMap['/docs']}>
      <Intro />
    </DocsLayout>
  );
}
