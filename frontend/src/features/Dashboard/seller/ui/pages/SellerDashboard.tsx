import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Package,
  Layers,
  Ban,
  Sparkles,
} from "lucide-react";
import type { Product } from "../../../types/product";
import { useGetAllproducts } from "../../../hook/server/useGetproduct";
import type {
  ProductFormValues,
  ProductImageChanges,
  ProductUpdateInput,
} from "../../../../../schema/product.schema";
import AppNavbar from "../../../common/Navbar";
import { ProductFormModal } from "../components/ProductFormModal";
import { ProductDeleteModal } from "../components/ProductDeleteModal";
import { ProductViewModal } from "../components/ProductViewModal";
import Loader from "../../../../../components/ui/loader";
import { toast } from "sonner";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "../../../hook/server/useProductMutation";

export const SellerDashboardPage: React.FC = () => {
  const { data: products, isPending } = useGetAllproducts();

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Modal States
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [deleteTargetProduct, setDeleteTargetProduct] =
    useState<Product | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Hero Section Metrics
  const metrics = useMemo(() => {
    const total = products?.length;
    const active = products?.filter((p) => p.isActive).length;
    const inactive = total! - active!;
    const totalStock = products?.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalValuation = products?.reduce(
      (acc, p) => acc + (p.price?.amount || 0) * (p.stock || 0),
      0,
    );

    return {
      total,
      active,
      inactive,
      totalStock,
      totalValuation,
    };
  }, [products]);

  // Filtered Products for the Table
  const filteredProducts = useMemo(() => {
    return products?.filter((p) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && p.isActive) ||
        (statusFilter === "inactive" && !p.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const { mutateAsync: createProduct, isPending: createProductPending } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: updateProductPending } =
    useUpdateProduct();

  const { mutateAsync: deleteProduct, isPending: deleteProductPending } =
    useDeleteProduct();

  // Handler for create
  const handleCreateSubmit = async (values: ProductFormValues) => {
    const createRequest = createProduct(values);
    toast.promise(createRequest, {
      loading: "Creating Product...",
      success: () => {
        return "Product created successfully";
      },
      error: (err) => err.response?.data?.message || "Product creation failed",
    });
    await createRequest;
  };

  // Handler for edit
  const handleEditSubmit = async (
    values: ProductFormValues,
    imageChanges: ProductImageChanges,
  ) => {
    if (!editProduct) return;

    const updateValues: ProductUpdateInput = { ...values, ...imageChanges };

    const updateRequest = updateProduct({
      productId: editProduct._id,
      values: updateValues,
    });
    toast.promise(updateRequest, {
      loading: "Updating product...",
      success: () => {
        setEditProduct(null);
        return "Product updated successfully";
      },
      error: (err) => err.response?.data?.message || "Product update failed",
    });
    await updateRequest;
  };

  // Handler for delete
  const handleDeleteConfirm = async () => {
    if (!deleteTargetProduct) {
      toast.warning("Please select a product to delete");
      return;
    }

    const productId = deleteTargetProduct?._id;

    const deleteRequest = deleteProduct({ productId });
    toast.promise(deleteRequest, {
      loading: "Deleting product...",
      success: () => {
        setDeleteTargetProduct(null);
        return "Product deleted successfully";
      },
      error: (err) => err.response?.data?.message || "Product deletion failed",
    });
    await deleteRequest;
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d11] text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Shared Reusable Navbar in Seller Mode */}
      <AppNavbar role="seller" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Section with Metric Grid Boxes */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
                <Sparkles size={13} className="text-purple-400" />
                <span>Merchant Control Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Seller Inventory & Catalog
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Manage your product listings, inspect real-time catalog metrics,
                edit specifications, and update active availability.
              </p>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#7c5cfc] hover:bg-[#6c4be8] active:bg-[#5e3edc] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(124,92,252,0.35)] flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Product</span>
            </button>
          </div>

          {/* Metric Grid Boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {/* Total Products */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#242633] shadow-md relative overflow-hidden">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                TOTAL PRODUCTS
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
                {metrics.total}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
                <span>SKU items cataloged</span>
              </div>
            </div>

            {/* Active Products */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#242633] shadow-md relative overflow-hidden">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block font-mono">
                ACTIVE PRODUCTS
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono tracking-tight mt-1">
                {metrics.active}
              </div>
              <div className="text-[11px] text-emerald-400/80 font-mono mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live for buyer purchase</span>
              </div>
            </div>

            {/* Inactive Products */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#242633] shadow-md relative overflow-hidden">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block font-mono">
                INACTIVE
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-mono tracking-tight mt-1">
                {metrics.inactive}
              </div>
              <div className="text-[11px] text-rose-400/80 font-mono mt-1 flex items-center gap-1">
                <Ban size={12} />
                <span>Overlay disabled in store</span>
              </div>
            </div>

            {/* Inventory Units */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#14151b] border border-[#242633] shadow-md relative overflow-hidden">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block font-mono">
                TOTAL STOCK UNITS
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono tracking-tight mt-1">
                {metrics.totalStock}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1">
                <span>In-warehouse availability</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Controls Before Table */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by title, SKU, or category..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#14151b] border border-[#252733] text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Controls: Filter tabs & Create Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#14151b] border border-[#232530] rounded-xl">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#7c5cfc] text-white shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All ({products?.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Active ({metrics.active})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Inactive ({metrics.inactive})
              </button>
            </div>

            {/* Create Button on top before table */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <Plus size={15} />
              <span>Create Product</span>
            </button>
          </div>
        </div>

        {/* Animated Modern Dark Theme Table */}
        <div className="rounded-2xl border border-[#232532] bg-[#14151b] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#21232d] bg-[#111217]/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#1e2029] text-xs">
                {filteredProducts && filteredProducts?.length > 0 ? (
                  filteredProducts.map((product) => {
                    const primaryImg = product.images?.[0]?.url || "";

                    const formattedPrice = new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: product.price?.currency || "INR",
                      maximumFractionDigits: 0,
                    }).format(product.price?.amount || 0);

                    return (
                      <motion.tr
                        key={product._id || product.slug || product.sku}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-[#181922] transition-colors group"
                      >
                        {/* Product Image & Title */}
                        <td className="py-3 px-4 sm:px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-[#0e0f14] border border-[#242633] overflow-hidden shrink-0 flex items-center justify-center p-1 relative">
                              {primaryImg ? (
                                <img
                                  src={primaryImg}
                                  alt={product.title}
                                  className={`w-full h-full object-contain ${
                                    !product.isActive
                                      ? "filter grayscale opacity-60"
                                      : ""
                                  }`}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <Layers size={18} className="text-zinc-600" />
                              )}
                              {!product.isActive && (
                                <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Ban size={14} className="text-rose-400" />
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate group-hover:text-purple-300 transition-colors">
                                {product.title}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                                {product.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-zinc-300">
                          <span className="px-2.5 py-1 rounded-md bg-[#191a24] border border-[#272938] text-[11px] text-zinc-300 whitespace-nowrap">
                            {product.category || "General"}
                          </span>
                        </td>

                        {/* Price with Currency */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-purple-200 text-sm">
                            {formattedPrice}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {product.price?.currency || "INR"}
                          </span>
                        </td>

                        {/* Stock Quantity */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-zinc-200">
                            {product.stock}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {product.stock > 0
                              ? "units available"
                              : "out of stock"}
                          </span>
                        </td>

                        {/* Status (Active / Inactive) */}
                        <td className="py-3 px-4">
                          {product.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium font-mono whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-medium font-mono whitespace-nowrap">
                              <Ban size={11} />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Action Buttons: See, Edit, Delete */}
                        <td className="py-3 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* See Button */}
                            <button
                              type="button"
                              onClick={() => setViewProduct(product)}
                              title="See Product Details"
                              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#191a24] hover:bg-[#232533] border border-[#272938] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye size={14} className="text-purple-400" />
                              <span className="hidden sm:inline">See</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => setEditProduct(product)}
                              title="Edit Product"
                              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#191a24] hover:bg-[#232533] border border-[#272938] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 size={14} className="text-indigo-400" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetProduct(product)}
                              title="Delete Product"
                              className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-zinc-400">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={28} className="text-zinc-600 mb-2" />
                        <span className="text-sm font-bold text-white">
                          No products found
                        </span>
                        <span className="text-xs text-zinc-500 mt-1">
                          Try searching for another keyword or create a new
                          product.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* 1. View Modal */}
      <ProductViewModal
        isOpen={Boolean(viewProduct)}
        onClose={() => setViewProduct(null)}
        product={viewProduct}
      />

      {/* 2. Edit Modal */}
      <ProductFormModal
        isPending={updateProductPending}
        isOpen={Boolean(editProduct)}
        mode="edit"
        initialProduct={editProduct}
        onClose={() => setEditProduct(null)}
        onSubmit={handleEditSubmit}
      />

      {/* 3. Create Modal */}
      <ProductFormModal
        isPending={createProductPending}
        isOpen={isCreateModalOpen}
        mode="create"
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* 4. Delete Modal */}
      <ProductDeleteModal
        isPending={deleteProductPending}
        isOpen={Boolean(deleteTargetProduct)}
        onClose={() => setDeleteTargetProduct(null)}
        onConfirm={handleDeleteConfirm}
        product={deleteTargetProduct}
      />
    </div>
  );
};

export default SellerDashboardPage;
