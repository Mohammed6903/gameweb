import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const GameNotFound = () => {
  return (
    <div className="min-h-[500px] bg-[#2a1b52]/30 backdrop-blur-md rounded-2xl border-4 border-purple-800/50 flex flex-col items-center justify-center text-center space-y-6 p-8">
      <AlertTriangle 
        className="text-red-500 w-24 h-24 animate-pulse" 
        strokeWidth={1.5}
      />
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 mb-4">
          Game Not Found
        </h2>
        <p className="text-gray-300 max-w-md mx-auto text-lg leading-relaxed">
          We couldn't locate the game you're looking for. It might have been removed, 
          the link may be incorrect, or there could be a temporary issue with our system.
        </p>
      </div>
      <div className="flex space-x-4">
        <Link
          href="/" 
          className="inline-block px-6 py-3 rounded-full 
            bg-purple-700 text-white 
            hover:bg-purple-800 transition-colors
            font-semibold"
        >
          Return to Home
        </Link>
        {/* <a 
          href="/games" 
          className="inline-block px-6 py-3 rounded-full 
            bg-transparent border border-purple-700 text-purple-300 
            hover:bg-purple-700/30 transition-colors
            font-semibold"
        >
          Browse Games
        </a> */}
      </div>
    </div>
  );
};

export default GameNotFound;