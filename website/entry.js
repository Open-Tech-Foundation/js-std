import { guard, loaderRoutes, pages } from '@afw/routes';
// Client entry for `esdev start` / `esdev build`. The route map comes from the
// `@afw/routes` virtual module, and prerendered markup is adopted.
import { mountApp } from '@opentf/afw';

mountApp({
  pages,
  guard,
  loaders: loaderRoutes,
  target: document.getElementById('app'),
});
