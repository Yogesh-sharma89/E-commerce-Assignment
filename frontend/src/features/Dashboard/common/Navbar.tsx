import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

import { useGetUser, useLogoutMutation } from '../../auth/hooks/server/useAuth.ts';
import ProfileModal from './ProfileModal.tsx';
import { toast } from 'sonner';

export interface AppNavbarProps {
  role?: 'user' | 'seller';
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ role = 'user' }) => {

    const {data:currentUser} = useGetUser();
    
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSeller = role === 'seller' || location.pathname.startsWith('/seller');

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const {mutateAsync:logout,isPending} = useLogoutMutation();

  const handleLogout = async() => {
     
    try{
        await toast.promise(logout(),{
            loading:"Logging you out....",
            success:()=>{
                setProfileDropdownOpen(false);
                navigate("/login",{replace:true});
                return "Logout successfully"
            },
            error:(err)=> err.response?.data?.message || "Logout failed"
        }).unwrap()

    }catch(err){

    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#20222a] bg-[#0c0d11]/90 backdrop-blur-xl select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Brand Logo only */}
          <Link
            to={isSeller ? '/seller' : '/user'}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            aria-label="ShopFlow Home"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#6b44f2] to-[#8f70ff] flex items-center justify-center text-white shadow-md shadow-purple-600/25 group-hover:brightness-110 transition-all">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                ShopFlow
              </span>
              <span
                className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                  isSeller
                    ? 'text-purple-300 bg-purple-500/15 border-purple-500/30'
                    : 'text-zinc-400 bg-white/5 border-white/10'
                }`}
              >
                {isSeller ? 'SELLER HUB' : 'STORE'}
              </span>
            </div>
          </Link>


          {/* Right Side: Profile icon with username & modal opener */}
          <div className="flex items-center gap-3">
            {/* Quick Context Pill */}
            {!isSeller && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16171e] border border-[#262833] text-xs text-zinc-300">
                <ShoppingBag size={14} className="text-purple-400" />
                <span className="font-mono text-white font-semibold">1</span>
                <span className="text-zinc-500">item</span>
              </div>
            )}

            {/* Profile Dropdown Component */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                aria-label="User profile menu"
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#16171f] hover:bg-[#1e1f2a] border border-[#272935] hover:border-[#373949] transition-all cursor-pointer shadow-sm"
              >
                {/* Avatar with Status dot */}
                <div className="relative">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-tr from-[#6b44f2] to-[#9171ff] p-[1.5px] overflow-hidden">
                    <img
                      src={currentUser?.profileUrl}
                      alt={currentUser?.name}
                      className="w-full h-full rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0c0d11]" />
                </div>

                {/* Username */}
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-semibold text-white block leading-tight">
                    {currentUser?.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block leading-tight">
                    {isSeller ? 'Seller Mode' : 'Buyer Account'}
                  </span>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180 text-purple-300' : ''
                  }`}
                />
              </motion.button>

              {/* Animated Profile Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#14151b] border border-[#262835] shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(124,92,252,0.15)] py-2 z-50 overflow-hidden"
                  >
                    {/* User header in dropdown */}
                    <div className="px-4 py-2.5 border-b border-[#21232d] mb-1">
                      <p className="text-xs font-bold text-white tracking-tight">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="px-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <User size={15} className="text-purple-400" />
                        <span>View Profile</span>
                      </button>


                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <ShieldCheck size={15} className="text-emerald-400" />
                        <span>Security & Access</span>
                      </button>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-[#21232d] px-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={15} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 md:hidden transition-colors border border-[#272935] cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (NO login or register buttons) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden border-t border-[#20222a] bg-[#111217] px-4 pt-3 pb-6 overflow-hidden space-y-3"
            >
              {/* User overview card on mobile */}
              <div className="p-3 rounded-xl bg-[#171821] border border-[#262834] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-[#6b44f2] to-[#9171ff] p-[1.5px] overflow-hidden">
                    <img
                      src={currentUser?.profileUrl}
                      alt={currentUser?.name}
                      className="w-full h-full rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {currentUser?.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 block font-mono">
                      {isSeller ? 'Seller Account' : 'Buyer Account'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-semibold hover:bg-purple-500/30 transition-colors"
                >
                  Profile
                </button>
              </div>

              {/* Mobile Role Navigation Links
              <div className="space-y-1">
                <Link
                  to="/user"
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    !isSeller
                      ? 'bg-purple-500/15 text-purple-200 border border-purple-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  All Products (Buyer View)
                </Link>

                <Link
                  to="/seller"
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isSeller
                      ? 'bg-purple-500/15 text-purple-200 border border-purple-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Seller Dashboard (Merchant View)
                </Link>
              </div> */}

              {/* Mobile Logout Button */}
              <div className="pt-2 border-t border-[#20222a]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out of ShopFlow</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
      />
    </>
  );
};

export default AppNavbar;
