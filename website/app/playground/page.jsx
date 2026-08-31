import Playground from '../components/Playground.jsx';
import VisualTools from '../components/VisualTools.jsx';

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

      <Playground />

      <div class="mt-16 mb-8 text-center">
        <h2 class="text-2xl font-bold mb-2">Interactive Visual Tools</h2>
        <p class="text-gray-400">
          Simulate and visualize the flow control utilities in real time.
        </p>
      </div>
      <VisualTools />
    </main>
  );
}
