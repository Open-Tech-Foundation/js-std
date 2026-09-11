import PlaygroundTabs from '../components/PlaygroundTabs.jsx';

export const metadata = {
  title: 'Playground',
  description:
    'Write and run code against @opentf/std in the browser, and visualise its flow control utilities.',
};

export default function PlaygroundPage() {
  return (
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold mb-2">Playground</h1>
        <p class="text-gray-400">
          Run @opentf/std in your browser. Nothing is installed and nothing
          leaves the page.
        </p>
      </div>

      <PlaygroundTabs />
    </main>
  );
}
