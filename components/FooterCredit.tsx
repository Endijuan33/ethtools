import { Github } from 'lucide-react';

export default function FooterCredit() {
  return (
    <footer className="text-center p-4 mt-8">
      <a 
        href="https://github.com/endijuan33"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-col items-center text-gray-400 hover:text-white transition-colors"
      >
        <Github size={28} />
        <p className="mt-1 text-sm">Built by endcore</p>
      </a>
    </footer>
  );
}
