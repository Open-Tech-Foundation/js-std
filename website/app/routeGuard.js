export default async function routeGuard(to, { next, redirect }) {
  if (to.pathname === '/') {
    return redirect('/docs');
  }
  return next();
}
