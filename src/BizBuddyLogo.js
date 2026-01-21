import React from 'react';

const BizBuddyLogo = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`bizbuddy-logo ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'white',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      <svg 
        width={size * 0.7} 
        height={size * 0.7} 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2196F3" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1976D2" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
        </defs>
        
        {/* Infinity symbol */}
        <path 
          d="M20 50 C20 35, 30 25, 40 25 C50 25, 55 35, 55 50 C55 35, 60 25, 70 25 C80 25, 90 35, 90 50 C90 65, 80 75, 70 75 C60 75, 55 65, 55 50 C55 65, 50 75, 40 75 C30 75, 20 65, 20 50 Z" 
          fill="none" 
          stroke="url(#infinityGradient)" 
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Upward trending arrow */}
        <path 
          d="M25 30 L35 20 L32 20 L32 15 L28 15 L28 20 L25 20 Z" 
          fill="url(#arrowGradient)"
        />
        
        {/* Dollar sign in circle */}
        <circle 
          cx="75" 
          cy="30" 
          r="10" 
          fill="#4CAF50"
        />
        
        {/* Dollar sign */}
        <text 
          x="75" 
          y="35" 
          textAnchor="middle" 
          fontSize="12" 
          fontWeight="bold" 
          fill="white"
        >
          $
        </text>
      </svg>
    </div>
  );
};

export default BizBuddyLogo;