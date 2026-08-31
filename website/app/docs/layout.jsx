import { DocsLayout } from '@opentf/web-docs';
import config from '../../otfw.config.js';
import DocsRunner from '../components/DocsRunner.jsx';

export default function Layout(props) {
  return (
    <DocsLayout config={config.docs} frame={false}>
      {props.children}
      <DocsRunner />
    </DocsLayout>
  );
}
