import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
  Ban,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { Product } from '../../../types/product';


export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const [imageError, setImageError] = useState(false);

  const primaryImage = product.images?.[0]?.url || '';

  const productIdentifier =product._id ||  product.slug || product.sku;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.price?.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(product.price?.amount || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: product.isActive ? -4 : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col rounded-2xl bg-[#14151b] border transition-all duration-200 overflow-hidden shadow-lg select-none ${
        product.isActive
          ? 'border-[#232530] hover:border-[#7c5cfc]/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(124,92,252,0.14)]'
          : 'border-[#26272e] opacity-90'
      }`}
    >
      {/* Visual Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#101116] overflow-hidden flex items-center justify-center">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              product.isActive ? 'group-hover:scale-105' : 'filter grayscale contrast-75'
            }`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-zinc-500">
            <Layers className="w-12 h-12 text-zinc-600 mb-2" />
            <span className="text-xs text-zinc-500 font-mono">Image Preview</span>
          </div>
        )}

        {/* Ambient Top Glow */}
        <div className="absolute inset-0 bg-linear-to-t from-[#14151b] via-transparent to-transparent pointer-events-none" />

        {/* Category Pill Tag */}
        {product.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#0e0f14]/85 border border-white/10 text-zinc-300 backdrop-blur-md">
              {product.category}
            </span>
          </div>
        )}

        {/* Stock status indicator (for active products) */}
        {product.isActive && (
          <div className="absolute top-3 right-3 z-10">
            {product.stock > 0 ? (
              <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300">
                Low Stock
              </span>
            )}
          </div>
        )}

        {/* Product Inactive Overlay */}
        {!product.isActive && (
          <div className="absolute inset-0 z-20 bg-[#0a0b0e]/85 backdrop-blur-[3px] flex flex-col items-center justify-center p-5 text-center transition-all">
            <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2.5 shadow-lg shadow-rose-500/10">
              <Ban size={20} />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Product Not Available
            </span>
            <span className="text-[11px] text-zinc-400 mt-1 max-w-47.5 leading-snug">
              This item is currently out of catalog or suspended.
            </span>
            <div className="mt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5">
              Unavailable
            </div>
          </div>
        )}
      </div>

      {/* Card Content Body: Showing only necessary info */}
      <div className="flex-1 flex flex-col justify-between p-4.5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-purple-300 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#20222a] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              PRICE
            </span>
            <div className="text-lg font-bold text-white font-mono tracking-tight">
              {formattedPrice}
            </div>
          </div>

          {/* Action button */}
          {product.isActive ? (
            <Link
              to={`/user/products/${productIdentifier}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7c5cfc]/15 hover:bg-[#7c5cfc] text-purple-300 hover:text-white border border-[#7c5cfc]/30 hover:border-[#7c5cfc] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <span>View</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <Link
              to={`/user/products/${productIdentifier}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1f2029] text-zinc-400 border border-[#2b2d38] text-xs font-medium hover:text-zinc-200 transition-colors"
            >
              <span>Details</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};
