import React from 'react';

interface AvatarProps {
  type: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ type, className = 'w-12 h-12' }) => {
  switch (type) {
    case 'cat':
      return (
        <div className={`${className} rounded-full overflow-hidden bg-[#FFE5D4] border-2 border-white shadow-card flex items-center justify-center`}>
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <circle cx="50" cy="50" r="46" fill="#F4A261" />
            <polygon points="20,38 32,16 44,32" fill="#E76F51" />
            <polygon points="80,38 68,16 56,32" fill="#E76F51" />
            <polygon points="24,34 32,22 40,32" fill="#FFF0E6" />
            <polygon points="76,34 68,22 60,32" fill="#FFF0E6" />
            <ellipse cx="36" cy="50" rx="4" ry="5.5" fill="#264653" />
            <ellipse cx="64" cy="50" rx="4" ry="5.5" fill="#264653" />
            <circle cx="37" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="65" cy="48" r="1.5" fill="#FFFFFF" />
            <polygon points="47,58 53,58 50,62" fill="#E76F51" />
            <path d="M50 62 Q45 68 40 65 M50 62 Q55 68 60 65" stroke="#264653" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="56" x2="32" y2="58" stroke="#264653" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="64" x2="32" y2="62" stroke="#264653" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="56" x2="68" y2="58" stroke="#264653" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="64" x2="68" y2="62" stroke="#264653" strokeWidth="2" strokeLinecap="round" />
            <circle cx="28" cy="58" r="4" fill="#FF8E8E" opacity="0.6" />
            <circle cx="72" cy="58" r="4" fill="#FF8E8E" opacity="0.6" />
          </svg>
        </div>
      );

    case 'panda':
      return (
        <div className={`${className} rounded-full overflow-hidden bg-[#E2EAFC] border-2 border-white shadow-card flex items-center justify-center`}>
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <circle cx="50" cy="50" r="46" fill="#F8F9FA" />
            <circle cx="24" cy="24" r="14" fill="#2B2D42" />
            <circle cx="76" cy="24" r="14" fill="#2B2D42" />
            <circle cx="24" cy="24" r="7" fill="#6C757D" opacity="0.4" />
            <circle cx="76" cy="24" r="7" fill="#6C757D" opacity="0.4" />
            {/* Eye patches */}
            <ellipse cx="36" cy="48" rx="8" ry="11" fill="#2B2D42" transform="rotate(-15 36 48)" />
            <ellipse cx="64" cy="48" rx="8" ry="11" fill="#2B2D42" transform="rotate(15 64 48)" />
            <circle cx="36" cy="47" r="3" fill="#FFFFFF" />
            <circle cx="64" cy="47" r="3" fill="#FFFFFF" />
            <circle cx="37" cy="46" r="1" fill="#2B2D42" />
            <circle cx="65" cy="46" r="1" fill="#2B2D42" />
            <ellipse cx="50" cy="62" rx="6" ry="4" fill="#2B2D42" />
            <path d="M50 66 Q44 72 38 70 M50 66 Q56 72 62 70" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="58" r="5" fill="#FFB4B4" opacity="0.6" />
            <circle cx="76" cy="58" r="5" fill="#FFB4B4" opacity="0.6" />
          </svg>
        </div>
      );

    case 'bear':
      return (
        <div className={`${className} rounded-full overflow-hidden bg-[#E9D8A6] border-2 border-white shadow-card flex items-center justify-center`}>
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <circle cx="50" cy="50" r="46" fill="#8C5835" />
            <circle cx="24" cy="24" r="13" fill="#683B1B" />
            <circle cx="76" cy="24" r="13" fill="#683B1B" />
            <circle cx="24" cy="24" r="7" fill="#E9D8A6" />
            <circle cx="76" cy="24" r="7" fill="#E9D8A6" />
            <ellipse cx="50" cy="65" rx="19" ry="14" fill="#E9D8A6" />
            <circle cx="37" cy="44" r="4.5" fill="#231815" />
            <circle cx="63" cy="44" r="4.5" fill="#231815" />
            <circle cx="38" cy="43" r="1.5" fill="#FFFFFF" />
            <circle cx="64" cy="43" r="1.5" fill="#FFFFFF" />
            <ellipse cx="50" cy="60" rx="6" ry="4.5" fill="#4A2E1B" />
            <path d="M50 64.5 Q50 72 43 72 M50 64.5 Q50 72 57 72" stroke="#4A2E1B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="26" cy="56" r="4" fill="#FF8E8E" opacity="0.6" />
            <circle cx="74" cy="56" r="4" fill="#FF8E8E" opacity="0.6" />
          </svg>
        </div>
      );

    case 'fox':
      return (
        <div className={`${className} rounded-full overflow-hidden bg-[#FFE3C7] border-2 border-white shadow-card flex items-center justify-center`}>
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <circle cx="50" cy="50" r="46" fill="#E76F51" />
            <polygon points="18,34 30,8 46,26" fill="#264653" />
            <polygon points="82,34 70,8 54,26" fill="#264653" />
            <polygon points="22,30 30,16 40,26" fill="#FFF0E6" />
            <polygon points="78,30 70,16 60,26" fill="#FFF0E6" />
            {/* White cheeks */}
            <path d="M12 50 C26 70 42 74 50 82 C58 74 74 70 88 50 C74 44 60 48 50 60 C40 48 26 44 12 50 Z" fill="#FFFFFF" />
            <ellipse cx="36" cy="46" rx="4" ry="5.5" fill="#264653" />
            <ellipse cx="64" cy="46" rx="4" ry="5.5" fill="#264653" />
            <circle cx="37" cy="44" r="1.5" fill="#FFFFFF" />
            <circle cx="65" cy="44" r="1.5" fill="#FFFFFF" />
            <polygon points="46,78 54,78 50,83" fill="#264653" />
            <circle cx="28" cy="54" r="4" fill="#FF8E8E" opacity="0.6" />
            <circle cx="72" cy="54" r="4" fill="#FF8E8E" opacity="0.6" />
          </svg>
        </div>
      );

    case 'tiger':
    default:
      return (
        <div className={`${className} rounded-full overflow-hidden bg-[#FFE5B4] border-2 border-white shadow-card flex items-center justify-center`}>
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <circle cx="50" cy="50" r="46" fill="#FBA834" />
            <path d="M22 28 C15 15 28 8 36 20 Z" fill="#E1701A" />
            <path d="M78 28 C85 15 72 8 64 20 Z" fill="#E1701A" />
            <path d="M25 24 C20 18 28 14 32 20 Z" fill="#FFF4E0" />
            <path d="M75 24 C80 18 72 14 68 20 Z" fill="#FFF4E0" />
            <circle cx="36" cy="62" r="14" fill="#FFF5E4" />
            <circle cx="64" cy="62" r="14" fill="#FFF5E4" />
            <path d="M46 16 L54 16 L50 26 Z" fill="#38220F" />
            <path d="M18 46 L26 48 L22 54 Z" fill="#38220F" />
            <path d="M82 46 L74 48 L78 54 Z" fill="#38220F" />
            <ellipse cx="36" cy="46" rx="4.5" ry="6" fill="#231815" />
            <ellipse cx="64" cy="46" rx="4.5" ry="6" fill="#231815" />
            <circle cx="37.5" cy="44" r="1.5" fill="#FFFFFF" />
            <circle cx="65.5" cy="44" r="1.5" fill="#FFFFFF" />
            <polygon points="46,55 54,55 50,60" fill="#E1701A" />
            <path d="M50 60 Q50 66 43 66 M50 60 Q50 66 57 66" stroke="#38220F" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="28" cy="54" r="3.5" fill="#FF8E8E" opacity="0.6" />
            <circle cx="72" cy="54" r="3.5" fill="#FF8E8E" opacity="0.6" />
          </svg>
        </div>
      );
  }
};

