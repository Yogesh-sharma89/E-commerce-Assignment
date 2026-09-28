import React from 'react';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({
  label = 'OR CONTINUE WITH',
}) => {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#23242a]" />
      </div>
      <div className="relative px-3 bg-[#18191e] text-[11px] font-semibold tracking-wider text-zinc-500 uppercase select-none">
        {label}
      </div>
    </div>
  );
};
