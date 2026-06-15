import React from 'react';

type BloomieState = 'wave' | 'success' | 'think' | 'error' | 'neutral';

interface BloomieProps {
  state: BloomieState;
  size?: number;
  className?: string;
}

export default function Bloomie({ state, size = 180, className = '' }: BloomieProps) {
  // Common styling details
  const bodyColor = "#FFFFFF";
  const shadowColor = "#E2D9F3";
  const cheekColor = "#FF8DA1";
  const eyeColor = "#1D103B";
  const screenColor = "#06B6D4";
  const glowColor = "rgba(6, 182, 212, 0.4)";

  // Dynamic SVG based on state
  switch (state) {
    case 'wave':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`float-anim ${className}`}
        >
          {/* Main Floating Body Shadow */}
          <ellipse cx="100" cy="180" rx="45" ry="6" fill="#0D061D" opacity="0.4" />
          
          {/* Left Arm (holding tablet) */}
          <path d="M62 120 C50 120 48 135 60 138 C70 140 75 125 70 120" fill={bodyColor} />
          
          {/* Waving Arm (Right) */}
          <path d="M138 100 C150 75 165 80 155 95 C148 105 140 110 132 112" fill={bodyColor} />
          {/* Waving motion lines */}
          <path d="M165 72 C168 76 168 82 165 85" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
          <path d="M172 78 C175 82 175 87 172 90" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />

          {/* Main Blob Body */}
          <path
            d="M60 80 C60 40 140 40 140 80 C140 100 145 130 140 160 C135 170 125 170 120 160 C115 152 105 152 100 160 C95 168 85 168 80 160 C75 152 65 152 60 160 C55 170 45 170 60 120 C60 100 60 90 60 80Z"
            fill={bodyColor}
          />
          {/* Body Bottom Shadow Curve */}
          <path
            d="M60 160 C65 152 75 152 80 160 C85 168 95 168 100 160 C105 152 115 152 120 160 C125 170 135 170 140 160 C138 163 130 165 120 162 C112 155 108 155 100 162 C92 169 88 169 80 162 C72 155 68 155 60 162 C60 161 60 160 60 160Z"
            fill={shadowColor}
          />

          {/* Big Expressive Eyes */}
          <circle cx="85" cy="85" r="7" fill={eyeColor} />
          <circle cx="115" cy="85" r="7" fill={eyeColor} />
          {/* Eye shines */}
          <circle cx="83" cy="83" r="2.5" fill="#FFFFFF" />
          <circle cx="113" cy="83" r="2.5" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <circle cx="76" cy="94" r="5" fill={cheekColor} />
          <circle cx="124" cy="94" r="5" fill={cheekColor} />

          {/* Happy Open Mouth */}
          <path d="M96 93 C96 100 104 100 104 93 Z" fill="#E23E57" />

          {/* Glowing Coding Tablet */}
          <rect x="42" y="115" width="28" height="20" rx="3" fill="#1F1635" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="46" y="119" width="20" height="12" rx="1.5" fill={screenColor} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }} />
          {/* Simple lines inside tablet */}
          <line x1="49" y1="123" x2="55" y2="123" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="49" y1="127" x2="60" y2="127" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'success':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`bounce-slow ${className}`}
        >
          {/* Floating Shadow (moving with bounce) */}
          <ellipse cx="100" cy="180" rx="50" ry="8" fill="#0D061D" opacity="0.5" />

          {/* Raising Left Arm */}
          <path d="M60 100 C45 80 35 85 45 105 C52 115 58 120 62 122" fill={bodyColor} />
          {/* Raising Right Arm */}
          <path d="M140 100 C155 80 165 85 155 105 C148 115 142 120 138 122" fill={bodyColor} />

          {/* Sparkly Star Left */}
          <path d="M35 55 L38 62 L45 65 L38 68 L35 75 L32 68 L25 65 L32 62 Z" fill="#FBBF24" />
          {/* Sparkly Star Right */}
          <path d="M165 45 L167 50 L173 52 L167 54 L165 59 L163 54 L157 52 L163 50 Z" fill="#FBBF24" />

          {/* Main Blob Body */}
          <path
            d="M60 80 C60 40 140 40 140 80 C140 100 145 130 140 160 C135 170 125 170 120 160 C115 152 105 152 100 160 C95 168 85 168 80 160 C75 152 65 152 60 160 C55 170 45 170 60 120 C60 100 60 90 60 80Z"
            fill={bodyColor}
          />
          <path
            d="M60 160 C65 152 75 152 80 160 C85 168 95 168 100 160 C105 152 115 152 120 160 C125 170 135 170 140 160 C138 163 130 165 120 162 C112 155 108 155 100 162 C92 169 88 169 80 162 C72 155 68 155 60 162 Z"
            fill={shadowColor}
          />

          {/* Star/Happy Eyes (^ ^) */}
          <path d="M78 86 C82 81 86 81 90 86" stroke={eyeColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M110 86 C114 81 118 81 122 86" stroke={eyeColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />

          {/* Rosy Cheeks */}
          <circle cx="73" cy="94" r="6" fill={cheekColor} />
          <circle cx="127" cy="94" r="6" fill={cheekColor} />

          {/* Massive Grin */}
          <path d="M92 92 C92 105 108 105 108 92 Z" fill="#E23E57" />
          <path d="M94 92 C96 96 104 96 106 92 Z" fill="#FFFFFF" />
        </svg>
      );

    case 'think':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`float-anim ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="45" ry="6" fill="#0D061D" opacity="0.4" />

          {/* Left Arm down */}
          <path d="M62 120 C55 130 52 140 60 142 C68 144 72 135 68 122" fill={bodyColor} />
          {/* Right Arm touching chin */}
          <path d="M138 120 C130 115 116 112 110 118 C105 123 112 128 122 126 C130 125 135 125 138 122" fill={bodyColor} />

          {/* Thinking Bulb/Idea */}
          <g transform="translate(140, 20)">
            <circle cx="15" cy="15" r="12" fill="#FEE2E2" />
            <path d="M15 6 L15 18 M9 12 L21 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="15" r="7" fill="#FCD34D" />
            <path d="M12 24 L18 24 M13 27 L17 27" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Main Body */}
          <path
            d="M60 80 C60 40 140 40 140 80 C140 100 145 130 140 160 C135 170 125 170 120 160 C115 152 105 152 100 160 C95 168 85 168 80 160 C75 152 65 152 60 160 C55 170 45 170 60 120 C60 100 60 90 60 80Z"
            fill={bodyColor}
          />
          <path
            d="M60 160 C65 152 75 152 80 160 C85 168 95 168 100 160 C105 152 115 152 120 160 C125 170 135 170 140 160 C138 163 130 165 120 162 C112 155 108 155 100 162 Z"
            fill={shadowColor}
          />

          {/* Thinking Eyes looking up-right */}
          <ellipse cx="89" cy="81" rx="5" ry="7" fill={eyeColor} />
          <ellipse cx="119" cy="81" rx="5" ry="7" fill={eyeColor} />
          {/* Pupil shifts */}
          <circle cx="91" cy="78" r="2.2" fill="#FFFFFF" />
          <circle cx="121" cy="78" r="2.2" fill="#FFFFFF" />

          {/* Curious Eyebrows */}
          <path d="M82 72 C85 70 90 71 94 74" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M112 70 C116 68 122 69 126 71" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Rosy Cheeks */}
          <circle cx="76" cy="94" r="5" fill={cheekColor} opacity="0.7" />
          <circle cx="124" cy="94" r="5" fill={cheekColor} opacity="0.7" />

          {/* Cute Whistling / Thinking Mouth */}
          <circle cx="101" cy="94" r="4.5" fill={eyeColor} />
          <circle cx="101" cy="94" r="2.2" fill="#E23E57" />
        </svg>
      );

    case 'error':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`float-anim ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="40" ry="5" fill="#0D061D" opacity="0.4" />

          {/* Hands held together in front, shy/apologetic */}
          <path d="M80 126 C82 120 90 120 94 125 C98 128 92 135 84 132" fill={bodyColor} />
          <path d="M120 126 C118 120 110 120 106 125 C102 128 108 135 116 132" fill={bodyColor} />

          {/* Main Body */}
          <path
            d="M60 80 C60 40 140 40 140 80 C140 100 145 130 140 160 C135 170 125 170 120 160 C115 152 105 152 100 160 C95 168 85 168 80 160 C75 152 65 152 60 160 C55 170 45 170 60 120 C60 100 60 90 60 80Z"
            fill={bodyColor}
          />
          <path
            d="M60 160 C65 152 75 152 80 160 C85 168 95 168 100 160 C105 152 115 152 120 160 C125 170 135 170 140 160 C138 163 130 165 120 162 C112 155 108 155 100 162 Z"
            fill={shadowColor}
          />

          {/* Shy/Dizzy Eyes (> <) */}
          <path d="M78 80 L88 88 M78 88 L88 80" stroke={eyeColor} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M112 80 L122 88 M112 88 L122 80" stroke={eyeColor} strokeWidth="4.5" strokeLinecap="round" />

          {/* Rosy Cheeks (blue-ish / flustered cheeks) */}
          <circle cx="73" cy="94" r="5" fill="#5F93E8" opacity="0.6" />
          <circle cx="127" cy="94" r="5" fill="#5F93E8" opacity="0.6" />

          {/* Small Wavy Sad Mouth */}
          <path d="M94 98 C96 95 98 95 100 98 C102 101 104 101 106 98" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'neutral':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`float-anim ${className}`}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="45" ry="6" fill="#0D061D" opacity="0.4" />

          {/* Hands holding tablet */}
          <path d="M62 122 C52 122 50 132 60 135 C68 137 72 130 68 122" fill={bodyColor} />
          <path d="M138 122 C148 122 150 132 140 135 C132 137 128 130 132 122" fill={bodyColor} />

          {/* Main Body */}
          <path
            d="M60 80 C60 40 140 40 140 80 C140 100 145 130 140 160 C135 170 125 170 120 160 C115 152 105 152 100 160 C95 168 85 168 80 160 C75 152 65 152 60 160 C55 170 45 170 60 120 C60 100 60 90 60 80Z"
            fill={bodyColor}
          />
          <path
            d="M60 160 C65 152 75 152 80 160 C85 168 95 168 100 160 C105 152 115 152 120 160 C125 170 135 170 140 160 C138 163 130 165 120 162 C112 155 108 155 100 162 Z"
            fill={shadowColor}
          />

          {/* Standard Curious Eyes */}
          <circle cx="85" cy="85" r="7" fill={eyeColor} />
          <circle cx="115" cy="85" r="7" fill={eyeColor} />
          <circle cx="83" cy="83" r="2.5" fill="#FFFFFF" />
          <circle cx="113" cy="83" r="2.5" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <circle cx="76" cy="94" r="5" fill={cheekColor} />
          <circle cx="124" cy="94" r="5" fill={cheekColor} />

          {/* Small Smile */}
          <path d="M96 93 C98 96 102 96 104 93" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Glowing Coding Tablet */}
          <rect x="70" y="118" width="60" height="40" rx="6" fill="#1F1635" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="76" y="124" width="48" height="28" rx="3" fill={screenColor} style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }} />
          {/* Simple lines inside tablet */}
          <line x1="82" y1="130" x2="94" y2="130" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="136" x2="110" y2="136" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="142" x2="102" y2="142" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
