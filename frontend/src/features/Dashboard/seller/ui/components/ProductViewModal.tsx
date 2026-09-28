import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Truck,
  RotateCcw,
  Ban,
  Layers,
  Calendar,
  Package,
} from "lucide-react";
import type { Product } from "../../../types/product";

export interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!product) return null;

  const images = product.images || [];
  const currentImage = images[selectedImgIndex]?.url || images[0]?.url || "";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price?.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price?.amount || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
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
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14151b] border border-[#272935] shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_30px_rgba(124,92,252,0.15)] p-5 sm:p-7"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#21232d]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/25">
                  {product.sku}
                </span>
                {product.isActive ? (
                  <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active in Catalog
                  </span>
                ) : (
                  <span className="text-xs font-mono font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/25 flex items-center gap-1">
                    <Ban size={12} />
                    Inactive / Unavailable
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Body */}
            <div className="mt-5 space-y-6">
              {/* Image & Price hero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                {/* Main Image */}
                <div className="space-y-3">
                  <div className="relative aspect-square w-full rounded-2xl bg-[#0f1015] border border-[#232532] overflow-hidden flex items-center justify-center p-3">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={product.title}
                        className={`w-full h-full object-contain ${
                          !product.isActive ? "filter grayscale" : ""
                        }`}
                      />
                    ) : (
                      <Layers size={36} className="text-zinc-600" />
                    )}
                  </div>

                  {/* Thumbnail gallery if multiple images */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={img.publicId || i}
                          type="button"
                          onClick={() => setSelectedImgIndex(i)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            selectedImgIndex === i
                              ? "border-[#7c5cfc] ring-1 ring-[#7c5cfc]"
                              : "border-[#262835] opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img.thumbnailUrl || img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Core specs */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      {product.category || "General Merchandise"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                      {product.title}
                    </h2>
                  </div>

                  {/* Price Banner */}
                  <div className="p-3.5 rounded-xl bg-[#191a24] border border-[#272938]">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                      LISTED PRICE
                    </span>
                    <div className="text-2xl font-extrabold text-purple-300 font-mono tracking-tight mt-0.5">
                      {formattedPrice}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                      Currency: {product.price?.currency || "INR"}
                    </div>
                  </div>

                  {/* Stock inventory */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#171821] border border-[#252735] text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Package size={14} className="text-purple-400" />
                      Available Stock
                    </span>
                    <span className="font-mono font-bold text-white">
                      {product.stock} units
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                    <Calendar size={12} className="text-zinc-500" />
                    <span>
                      Updated:{" "}
                      {product.updatedAt
                        ? new Date(product.updatedAt).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Product Description
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed p-3.5 rounded-xl bg-[#121319] border border-[#22242e]">
                  {product.description}
                </p>
              </div>

              {/* Optional Fields (Features, Shipping, Return) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features && (
                  <div className="p-3.5 rounded-xl bg-[#121319] border border-[#22242e] sm:col-span-2">
                    <h5 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 mb-1.5">
                      <Sparkles size={13} className="text-purple-400" />
                      <span>Key Features</span>
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {product.features}
                    </p>
                  </div>
                )}

                {product.shippingInfo && (
                  <div className="p-3.5 rounded-xl bg-[#121319] border border-[#22242e]">
                    <h5 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 mb-1.5">
                      <Truck size={13} className="text-purple-400" />
                      <span>Shipping Logistics</span>
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {product.shippingInfo}
                    </p>
                  </div>
                )}

                {product.returnPolicy && (
                  <div className="p-3.5 rounded-xl bg-[#121319] border border-[#22242e]">
                    <h5 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 mb-1.5">
                      <RotateCcw size={13} className="text-purple-400" />
                      <span>Return Policy</span>
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {product.returnPolicy}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#21232d] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#20222b] hover:bg-[#282a36] text-xs font-semibold text-zinc-200 transition-colors border border-[#2d303e] cursor-pointer"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
