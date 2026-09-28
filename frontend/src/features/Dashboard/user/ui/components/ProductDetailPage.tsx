import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Sparkles,
  Ban,
  Layers,
} from "lucide-react";
import { useGetProduct } from "../../../hook/server/useGetproduct";
import AppNavbar from "../../../common/Navbar";
import Loader from "../../../../../components/ui/loader";

export const ProductDetailPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProduct(productId?.trim());

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [addedToBag, setAddedToBag] = useState(false);

  if (isLoading) {
    return <Loader label="Preparing your product..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0c0d11] text-zinc-100">
        <AppNavbar role="user" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#171821] border border-[#2a2c3a] flex items-center justify-center text-zinc-500 mb-4">
            <Ban size={30} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Product Not Found
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-6">
            The requested product with identifier{" "}
            <span className="font-mono text-purple-300 font-semibold">
              {productId}
            </span>{" "}
            does not exist or has been removed.
          </p>
          <Link
            to="/user"
            className="px-5 py-2.5 rounded-xl bg-[#7c5cfc] hover:bg-[#6c4be8] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentImage =
    product.images?.[selectedImageIndex]?.url || product.images?.[0]?.url || "";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price?.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price?.amount || 0);

  const handleAddToBag = () => {
    if (!product.isActive) return;
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d11] text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Reusable Navbar */}
      <AppNavbar role="user" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/user"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={15}
              className="text-purple-400 group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to All Products</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Link to="/user" className="hover:text-zinc-300">
              ShopFlow
            </Link>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-50">
              {product.title}
            </span>
          </div>
        </div>

        {/* Inactive Product Banner (if not active) */}
        {!product.isActive && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 flex items-start gap-3.5 shadow-lg"
          >
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <Ban size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Product Currently Not Available
              </h4>
              <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">
                This item is temporarily suspended from active checkout. You can
                still review technical attributes, dimensions, and release
                specifications below.
              </p>
            </div>
          </motion.div>
        )}

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4">
            {/* Primary Main Image Container */}
            <div className="relative aspect-4/3 w-full rounded-3xl bg-[#14151b] border border-[#252733] overflow-hidden flex items-center justify-center p-4 shadow-xl">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  className={`w-full h-full object-contain max-h-115 transition-all duration-300 ${
                    !product.isActive ? "filter grayscale contrast-75" : ""
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
                  <Layers className="w-16 h-16 text-zinc-600 mb-2" />
                  <span className="text-xs font-mono text-zinc-500">
                    Image Not Available
                  </span>
                </div>
              )}

              {/* Inactive Watermark Overlay */}
              {!product.isActive && (
                <div className="absolute inset-0 bg-[#0a0b0e]/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none">
                  <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold">
                    Product Not Available
                  </span>
                </div>
              )}

              {/* Category Tag overlay */}
              {product.category && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#0e0f14]/85 border border-white/10 text-zinc-200 backdrop-blur-md">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (if multiple images) */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={img.publicId || idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#14151b] border-2 transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? "border-[#7c5cfc] ring-2 ring-[#7c5cfc]/30 shadow-md"
                          : "border-[#262833] hover:border-zinc-500 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.thumbnailUrl || img.url}
                        alt={`${product.title} thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Specification & Ordering Panel (5-6 cols on lg) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between">
            <div>
              {/* SKU & Category Row */}
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-[11px] font-mono font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {product.sku}
                </span>

                {product.isActive ? (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Not Available
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Price Banner */}
              <div className="mt-4 p-4 rounded-2xl bg-[#14151b] border border-[#252733] flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                    CURRENT PRICE
                  </span>
                  <div className="text-3xl font-extrabold text-white font-mono tracking-tight mt-0.5">
                    {formattedPrice}
                  </div>
                </div>
                <div className="text-right text-[11px] text-zinc-400 font-mono">
                  <span>Inclusive of all taxes</span>
                  <div className="text-emerald-400 font-medium">
                    Free delivery
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Overview
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features (Optional field from user prompt) */}
              {product.features && (
                <div className="mt-5 p-4 rounded-xl bg-[#13141a] border border-[#22242e]">
                  <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-purple-400" />
                    Key Features
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {product.features}
                  </p>
                </div>
              )}

              {/* Quantity & CTA Row */}
              <div className="mt-6 pt-5 border-t border-[#20222a] space-y-3">
                {product.isActive ? (
                  <>
                    <div className="flex items-center gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-[#15161f] border border-[#272936] rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 rounded-lg bg-[#20222e] hover:bg-[#282a39] text-white text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono font-semibold text-sm text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) => Math.min(product.stock, q + 1))
                          }
                          className="w-8 h-8 rounded-lg bg-[#20222e] hover:bg-[#282a39] text-white text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Bag Button */}
                      <motion.button
                        type="button"
                        onClick={handleAddToBag}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1 h-11 px-6 rounded-xl bg-[#7c5cfc] hover:bg-[#6c4be8] active:bg-[#5e3edc] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(124,92,252,0.35)] cursor-pointer"
                      >
                        {addedToBag ? (
                          <>
                            <Check size={16} />
                            <span>Added to Bag!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/user")}
                      className="w-full h-11 rounded-xl bg-[#20212b] hover:bg-[#282a37] text-zinc-200 hover:text-white border border-[#2e313f] text-sm font-semibold transition-all cursor-pointer"
                    >
                      Instant Checkout with ShopFlow Pay
                    </button>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-[#191a22] border border-[#292b38] text-center">
                    <p className="text-xs font-semibold text-zinc-400">
                      Purchasing is currently disabled for this product.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Spec Details Cards (Shipping, Returns, Trust) */}
            <div className="mt-8 pt-6 border-t border-[#20222a] space-y-2.5">
              {/* Shipping Info (Optional field from user prompt) */}
              {product.shippingInfo && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#14151b] border border-[#232530]">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
                    <Truck size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      Shipping & Delivery
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-snug">
                      {product.shippingInfo}
                    </span>
                  </div>
                </div>
              )}

              {/* Return Policy (Optional field from user prompt) */}
              {product.returnPolicy && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#14151b] border border-[#232530]">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
                    <RotateCcw size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      Return & Exchange Policy
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-snug">
                      {product.returnPolicy}
                    </span>
                  </div>
                </div>
              )}

              {/* Enterprise Security */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#14151b] border border-[#232530]">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">
                    100% Authentic & Insured Checkout
                  </span>
                  <span className="text-[11px] text-zinc-400 leading-snug">
                    Verified supplier batch guarantee with ShopFlow buyer
                    protection.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
