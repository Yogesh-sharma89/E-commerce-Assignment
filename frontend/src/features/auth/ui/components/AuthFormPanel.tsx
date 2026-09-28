import React from 'react';
import { motion } from 'framer-motion';

interface AuthFormPanelProps {
  heading: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthFormPanel = ({
  heading,
  subtitle,
  children,
}:AuthFormPanelProps) => {
  return (
    <div className="flex flex-col justify-center h-full p-6 sm:p-10 lg:p-12 bg-[#18191e]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-105 mx-auto"
      >
        <div className="mb-7">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white mb-2">
            {heading}
          </h1>
          <p className="text-sm text-zinc-400">
            {subtitle}
          </p>
        </div>

        {children}
      </motion.div>
    </div>
  );
};
