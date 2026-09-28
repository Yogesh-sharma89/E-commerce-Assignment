import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../../auth/hooks/server/useAuth.ts";
import { toast } from "sonner";

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const navigate = useNavigate();

  

  const {mutateAsync:logout,isPending} = useLogoutMutation();

  const handleLogout = async() => {
     
    try{
        await toast.promise(logout(),{
            loading:"Logging you out....",
            success:()=>{
                onClose();
                navigate("/login",{replace:true});
                return "Logout successfully"
            },
            error:(err)=> err.response?.data?.message || "Logout failed"
        }).unwrap()

    }catch(err){

    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0a0b0e]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-[#14151b] border border-[#272935] shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_30px_rgba(124,92,252,0.12)] p-6 overflow-hidden"
          >
            {/* Ambient Purple Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#21232d]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-200">
                  User Account
                </span>
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                aria-label="Close profile modal"
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Hero */}
            <div className="mt-5 flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#6842ed] to-[#8d6eff] p-[2px] shadow-lg shadow-purple-600/20">
                  <div className="w-full h-full rounded-[14px] bg-[#1a1b22] flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <User size={28} className="text-purple-300" />
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#14151b] flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {user.name}
                </h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="text-zinc-500" />
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                    <Calendar size={11} />
                    Member since {user.memberSince || "2024"}
                  </span>
                </div>
              </div>
            </div>

            {/* Security & Access Info */}
            <div className="mt-6 space-y-2">
              <div className="p-3 rounded-xl bg-[#191b24] border border-[#262835] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <Shield size={15} className="text-purple-400" />
                  <span>Two-Factor Authentication</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#191b24] border border-[#262835] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <User size={15} className="text-purple-400" />
                  <span>Session Access Level</span>
                </div>
                <span className="font-mono text-zinc-400 text-[11px]">
                  Verified Buyer (INR)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#21232d] flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#20222b] hover:bg-[#282a36] text-xs font-semibold text-zinc-200 transition-colors border border-[#2d303e] cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleLogout}
                className="flex-1 py-2.5 disabled:cursor-not-allowed px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default ProfileModal;
