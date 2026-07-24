import VisualTools from '../components/VisualTools.jsx';

export default function PlaygroundPage() {
  return (
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold mb-2">Interactive Visual Tools</h1>
        <p class="text-gray-400">
          Simulate and visualize @opentf/std flow control utilities in real
          time.
        </p>
      </div>
      <VisualTools />
    </main>
  );
}
