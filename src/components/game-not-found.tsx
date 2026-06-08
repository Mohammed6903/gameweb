import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const GameNotFound = () => {
  return (
    <div className="min-h-[500px] bg-[#2a1b52]/30 backdrop-blur-md rounded-2xl border-4 border-primary/50 flex flex-col items-center justify-center text-center space-y-6 p-8">
      <AlertTriangle
        className="text-destructive w-24 h-24 animate-pulse"
        strokeWidth={1.5}
      />
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-destructive to-accent mb-4">
          Game Not Found
        </h2>
        <p className="text-foreground max-w-md mx-auto text-lg leading-relaxed">
          We couldn't locate the game you're looking for. It might have been removed, 
          the link may be incorrect, or there could be a temporary issue with our system.
        </p>
      </div>
      <div className="flex space-x-4">
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full
            bg-primary text-primary-foreground
            hover:bg-primary/90 transition-colors
            font-semibold"
        >
          Return to Home
        </Link>
        {/* <a
          href="/games"
          className="inline-block px-6 py-3 rounded-full
            bg-transparent border border-primary text-primary
            hover:bg-primary/30 transition-colors
            font-semibold"
        >
          Browse Games
        </a> */}
      </div>
    </div>
  );
};

export default GameNotFound;