import React from 'react';

const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Ring */}
      <circle 
        cx="30" 
        cy="30" 
        r="28" 
        fill="url(#outerGradient)" 
        stroke="url(#strokeGradient)" 
        strokeWidth="2"
      />
      
      {/* Inner Ring */}
      <circle 
        cx="30" 
        cy="30" 
        r="22" 
        fill="url(#innerGradient)" 
        opacity="0.8"
      />
      
      {/* Center Diamond */}
      <path 
        d="M30 10 L45 25 L30 40 L15 25 Z" 
        fill="url(#centerGradient)"
        stroke="rgba(255,215,0,0.8)" 
        strokeWidth="1.5"
      />
      
      {/* Grab Lines */}
      <path 
        d="M20 22l10 8 10-8" 
        stroke="url(#lineGradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path 
        d="M20 30l10 8 10-8" 
        stroke="url(#lineGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      {/* Top Star */}
      <path 
        d="M30 8 L32 14 L38 14 L33.5 18 L35 24 L30 20 L25 24 L26.5 18 L22 14 L28 14 Z" 
        fill="url(#starGradient)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />
      
      {/* Professional Accents */}
      <circle cx="15" cy="15" r="2" fill="rgba(255,215,0,0.6)" />
      <circle cx="45" cy="15" r="2" fill="rgba(255,140,0,0.6)" />
      <circle cx="15" cy="45" r="2" fill="rgba(255,69,0,0.6)" />
      <circle cx="45" cy="45" r="2" fill="rgba(255,215,0,0.6)" />
      
      <defs>
        {/* Gradient Definitions */}
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e"/>
          <stop offset="50%" stopColor="#16213e"/>
          <stop offset="100%" stopColor="#0f3460"/>
        </linearGradient>
        
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FF8C00"/>
          <stop offset="100%" stopColor="#FF4500"/>
        </linearGradient>
        
        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
          <stop offset="50%" stopColor="rgba(255,215,0,0.8)"/>
          <stop offset="100%" stopColor="rgba(255,140,0,0.6)"/>
        </linearGradient>
        
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)"/>
        </linearGradient>
        
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FFA500"/>
        </linearGradient>
        
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,215,0,0.6)"/>
          <stop offset="50%" stopColor="rgba(255,140,0,0.8)"/>
          <stop offset="100%" stopColor="rgba(255,69,0,0.6)"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
