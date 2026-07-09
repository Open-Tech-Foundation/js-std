import { router } from '@opentf/web';

export default function Home() {
  onMount(() => {
    router.replace('/docs');
  });

  return <main />;
}
