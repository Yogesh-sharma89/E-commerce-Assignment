import React from "react";
import { Link, useLocation } from "react-router";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";
import { AuthBrandPanel } from "../ui/components/AuthBrandPanel";

const COPYRIGHT_YEAR = new Date().getFullYear();

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";
  const isSignup = location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d11] text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-purple-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <Link
          to="/login"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
          aria-label="ShopFlow home"
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#6b44f2] to-[#8f70ff] flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:brightness-110 transition-all">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            ShopFlow
          </span>
        </Link>

        {/* Right: Auth Switcher Links */}
        <nav className="flex items-center gap-2">
          <Link
            to="/login"
            className={`text-sm font-medium transition-all px-4 py-1.5 rounded-lg ${
              isLogin
                ? "bg-[#7c5cfc] text-white shadow-[0_2px_12px_rgba(124,92,252,0.35)]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className={`text-sm font-medium transition-all px-4 py-1.5 rounded-lg ${
              isSignup
                ? "bg-[#7c5cfc] text-white shadow-[0_2px_12px_rgba(124,92,252,0.35)]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-265 rounded-2xl bg-[#16171c] border border-[#262832] shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          {/* Two-Column Auth Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-155">
            {/* Left Column: Shared Brand Panel (Desktop & Tablet) */}
            <div className="hidden md:block">
              <AuthBrandPanel />
            </div>

            {/* Right Column: Dynamic Form (Login or Signup) */}
            <div className="flex flex-col justify-center">{children}</div>
          </div>
        </motion.div>
      </main>

      {/* Subdued Footer Trust Note */}
      <footer className="relative z-10 py-4 text-center text-xs text-zinc-500 font-normal">
        <p>ShopFlow Platform Infrastructure {COPYRIGHT_YEAR} &copy;</p>
      </footer>
    </div>
  );
};
