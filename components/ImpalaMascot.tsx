import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface ImpalaMascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'excited';
  onClick?: () => void;
  className?: string;
}

const ImpalaMascot: React.FC<ImpalaMascotProps> = ({ message, mood = 'happy', onClick, className = '' }) => {
  const [displayedMessage, setDisplayedMessage] = useState(message);

  useEffect(() => {
    setDisplayedMessage(message);
  }, [message]);

  // Simple SVG Impala representation
  const ImpalaSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg transition-transform hover:scale-105 duration-300">
       <defs>
        <linearGradient id="impalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      
      {/* Body/Head Shape */}
      <circle cx="100" cy="110" r="60" fill="url(#impalaGradient)" />
      
      {/* Ears */}
      <path d="M60 70 Q 40 20 80 50" fill="#ea580c" stroke="#fff" strokeWidth="2" />
      <path d="M140 70 Q 160 20 120 50" fill="#ea580c" stroke="#fff" strokeWidth="2" />

      {/* Horns */}
      <path d="M85 55 Q 70 10 90 20" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M115 55 Q 130 10 110 20" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Face details based on mood */}
      {mood === 'happy' && (
        <>
          <circle cx="80" cy="100" r="5" fill="#fff" />
          <circle cx="120" cy="100" r="5" fill="#fff" />
          <circle cx="82" cy="100" r="2" fill="#000" />
          <circle cx="118" cy="100" r="2" fill="#000" />
          <path d="M90 120 Q 100 130 110 120" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="80" cy="115" r="4" fill="#fcd34d" opacity="0.5" />
          <circle cx="120" cy="115" r="4" fill="#fcd34d" opacity="0.5" />
        </>
      )}
      
       {mood === 'excited' && (
        <>
          <path d="M75 95 L 85 105 L 75 115" stroke="#fff" strokeWidth="3" fill="none" />
          <path d="M125 95 L 115 105 L 125 115" stroke="#fff" strokeWidth="3" fill="none" />
          <path d="M90 125 Q 100 140 110 125" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {mood === 'thinking' && (
        <>
          <circle cx="80" cy="100" r="5" fill="#fff" />
          <circle cx="120" cy="100" r="5" fill="#fff" />
          <circle cx="82" cy="98" r="2" fill="#000" />
          <circle cx="118" cy="98" r="2" fill="#000" />
          <line x1="95" y1="120" x2="105" y2="120" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  return (
    <div className={`relative flex items-end ${className}`} onClick={onClick}>
      {/* Chat Bubble */}
      {displayedMessage && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 sm:w-64 z-20 animate-bounce-slight">
          <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-impala-100 text-stone-800 text-sm font-medium relative">
             <p className="leading-relaxed font-display">{displayedMessage}</p>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-impala-100 transform rotate-45"></div>
          </div>
        </div>
      )}
      
      {/* Mascot */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 cursor-pointer transform hover:-translate-y-1 transition-transform">
        <ImpalaSVG />
      </div>
    </div>
  );
};

export default ImpalaMascot;