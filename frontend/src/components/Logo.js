import React from 'react';

const Logo = ({ size = 'md', animate = true, showText = true }) => {
  const sizes = {
    sm: { icon: 'w-10 h-10', text: 'text-lg' },
    md: { icon: 'w-14 h-14', text: 'text-2xl' },
    medium: { icon: 'w-14 h-14', text: 'text-2xl' },
    lg: { icon: 'w-20 h-20', text: 'text-3xl' },
    large: { icon: 'w-20 h-20', text: 'text-3xl' },
    xl: { icon: 'w-28 h-28', text: 'text-5xl' },
  };

  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-4">
      <div className={`${icon} relative group`}>
        {/* Outer glow effect */}
        <div className={`absolute inset-0 rounded-lg bg-emerald-900/20 blur-lg ${animate ? 'group-hover:opacity-30 transition-opacity duration-500' : 'opacity-20'}`}></div>
        
        {/* Main logo container */}
        <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center overflow-hidden shadow-xl">
          {/* Inner subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800/10 to-transparent"></div>
          
          {/* Logo SVG */}
          <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 relative z-10">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Car outline with neural network fusion */}
            <g filter="url(#glow)">
              {/* Car body outline */}
              <path
                d="M 20 60 L 25 50 L 35 40 L 50 40 L 65 40 L 75 50 L 80 60 L 80 70 L 20 70 Z"
                stroke="url(#logoGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className={animate ? 'animate-pulse' : ''}
                style={{ animationDuration: '3s' }}
              />
              
              {/* Car windows */}
              <path
                d="M 35 45 L 40 40 L 48 40 L 48 50 L 35 50 Z"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className={animate ? 'animate-pulse' : ''}
                style={{ animationDuration: '3s', animationDelay: '0.3s' }}
              />
              <path
                d="M 52 40 L 60 40 L 65 45 L 65 50 L 52 50 Z"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className={animate ? 'animate-pulse' : ''}
                style={{ animationDuration: '3s', animationDelay: '0.3s' }}
              />
              
              {/* Wheels */}
              <circle 
                cx="32" 
                cy="70" 
                r="6" 
                stroke="url(#logoGradient)" 
                strokeWidth="2.5" 
                fill="none"
                className={animate ? 'animate-spin' : ''}
                style={{ animationDuration: '4s' }}
              />
              <circle 
                cx="68" 
                cy="70" 
                r="6" 
                stroke="url(#logoGradient)" 
                strokeWidth="2.5" 
                fill="none"
                className={animate ? 'animate-spin' : ''}
                style={{ animationDuration: '4s' }}
              />
              
              {/* Neural network nodes on car */}
              <circle cx="30" cy="45" r="2" fill="#86efac" className={animate ? 'animate-pulse' : ''} style={{ animationDelay: '0.5s' }} />
              <circle cx="50" cy="35" r="2.5" fill="#86efac" className={animate ? 'animate-pulse' : ''} style={{ animationDelay: '0.7s' }} />
              <circle cx="70" cy="45" r="2" fill="#86efac" className={animate ? 'animate-pulse' : ''} style={{ animationDelay: '0.9s' }} />
              <circle cx="50" cy="55" r="2" fill="#86efac" className={animate ? 'animate-pulse' : ''} style={{ animationDelay: '1.1s' }} />
              
              {/* Neural network connections */}
              <line x1="30" y1="45" x2="50" y2="35" stroke="#4ade80" strokeWidth="1" opacity="0.6" />
              <line x1="50" y1="35" x2="70" y2="45" stroke="#4ade80" strokeWidth="1" opacity="0.6" />
              <line x1="30" y1="45" x2="50" y2="55" stroke="#4ade80" strokeWidth="1" opacity="0.6" />
              <line x1="70" y1="45" x2="50" y2="55" stroke="#4ade80" strokeWidth="1" opacity="0.6" />
              
              {/* Brain circuit pattern above car */}
              <path
                d="M 40 25 L 45 30 M 45 30 L 50 25 M 50 25 L 55 30 M 55 30 L 60 25"
                stroke="#4ade80"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
                className={animate ? 'animate-pulse' : ''}
                style={{ animationDuration: '2s', animationDelay: '0.2s' }}
              />
              <circle cx="45" cy="30" r="1.5" fill="#86efac" />
              <circle cx="55" cy="30" r="1.5" fill="#86efac" />
            </g>
          </svg>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${text} font-bold leading-tight tracking-tight`}>
            <span className="text-emerald-700">Neuro</span>
            <span className="text-emerald-600">Fleet</span>
            <span className="text-emerald-800">X</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
