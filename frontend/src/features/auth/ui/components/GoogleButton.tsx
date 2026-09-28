import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GoogleButtonProps {
  label?: string;
  onClick?: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  label = 'Continue with Google',
  onClick,
}) => {
    
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setClicked(true);
      setTimeout(() => setClicked(false), 2400);
    }
  };

  return (
    <div className="w-full">
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.992 }}
        className="w-full py-2.5 px-4 rounded-lg bg-[#202127] hover:bg-[#272831] border border-[#2e303a] hover:border-[#3d404d] text-sm font-medium text-zinc-200 hover:text-white flex items-center justify-center gap-3 transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer"
      >
        <svg
          className="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>{label}</span>
      </motion.button>

      {clicked && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-xs text-purple-300/80 mt-2 font-normal"
        >
          Google OAuth is UI-only in this demo.
        </motion.p>
      )}
    </div>
  );
};
