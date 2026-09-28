import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X, Loader } from "lucide-react";
import type { Product } from "../../../types/product";

export interface ProductDeleteModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

export const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  onClose,
  isPending,
  onConfirm,
  product,
}) => {
  if (!product) return null;

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
            className="absolute inset-0 bg-[#0a0b0e]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-[#14151b] border border-[#272935] shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_30px_rgba(244,63,94,0.12)] p-6 overflow-hidden"
          >
            {/* Warning Icon Badge */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Confirmation Content */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Delete Product?
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Are you sure you want to permanently delete this product from
                your seller catalog? This action cannot be undone.
              </p>

              {/* Product preview card */}
              <div className="mt-4 p-3 rounded-xl bg-[#191a24] border border-[#262835] flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#0e0f14] border border-[#232530] overflow-hidden shrink-0 flex items-center justify-center">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Trash2 size={16} className="text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block truncate">
                    {product.title}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    SKU: {product.sku}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#20222a] flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#20222b] hover:bg-[#282a36] text-xs font-semibold text-zinc-200 transition-colors border border-[#2d303e] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className="flex-1 disabled:cursor-not-allowed py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-all shadow-[0_2px_14px_rgba(244,63,94,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <>
                   <Loader size={14}/>
                   <span>Deleting...</span>
                   </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
