import React, { useEffect, useState, useRef } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Edit3,
  AlertCircle,
  UploadCloud,
  Trash2,
  Loader,
  RotateCcw,
} from "lucide-react";
import type { Product, ProductMedia } from "../../../types/product";
import {
  productSchema,
  type ProductImageChanges,
  type ProductFormValues,
} from "../../../../../schema/product.schema.ts";
import FieldError from "../../../../../components/FieldError.tsx";

export interface ProductFormModalProps {
  isOpen: boolean;
  isPending?: boolean;
  mode: "create" | "edit";
  initialProduct?: Product | null;
  onClose: () => void;
  onSubmit: (
    values: ProductFormValues,
    imageChanges: ProductImageChanges,
  ) => Promise<void> | void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  mode,
  initialProduct,
  onClose,
  onSubmit,
  isPending,
}) => {
  const isEdit = mode === "edit";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [uploadWarning, setUploadWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      title: "",
      description: "",
      price: {
        amount: 0,
        currency: "INR",
      },
      stock: 50,
      brand: "",
      images: [],
      category: "Footwear & Streetwear",
      features: "",
      returnPolicy: "7-day easy return policy",
      shippingInfo: "Free express shipping across India",
      isActive: true,
    },
    mode: "onTouched",
  });

  const watchedImages = watch("images") || [];

  const [existingImages, setExistingImages] = useState<ProductMedia[]>([]);
  const [replaceImageIds, setReplaceImageIds] = useState<string[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const replacementTargetId = useRef<string | null>(null);

  const previewUrls = useRef(new Map<File, string>());

  const getPreviewUrl = (file: File) => {
    let previewUrl = previewUrls.current.get(file);
    if (!previewUrl) {
      previewUrl = URL.createObjectURL(file);
      previewUrls.current.set(file, previewUrl);
    }
    return previewUrl;
  };

  useEffect(() => {
    const objectUrls = previewUrls.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  // Re-populate when modal opens or edit target changes
  useEffect(() => {
    if (isOpen) {
      setUploadWarning(null);
      if (isEdit && initialProduct) {
        setExistingImages(initialProduct.images ?? []);
        setReplaceImageIds([]);
        setRemoveImageIds([]);

        reset({
          title: initialProduct.title || "",
          description: initialProduct.description || "",
          price: {
            amount: Number(initialProduct.price.amount) || 0,
            currency: initialProduct.price.currency || "INR",
          },
          stock: Number(initialProduct.stock || 0),
          images: [],
          brand: initialProduct.brand,
          category: initialProduct.category || "",
          features: initialProduct.features || "",
          returnPolicy: initialProduct.returnPolicy || "",
          shippingInfo: initialProduct.shippingInfo || "",
          isActive: Boolean(initialProduct.isActive),
        });
      } else {
        setExistingImages([]);
        setReplaceImageIds([]);
        setRemoveImageIds([]);
        reset({
          title: "",
          description: "",
          price: {
            amount: 500,
            currency: "INR",
          },
          stock: 25,
          images: [],
          category: "Footwear & Streetwear",
          brand: "",
          features:
            "Ergonomic cushioning, breathable mesh, durable rubber outsole",
          returnPolicy: "7-day easy return and exchange policy",
          shippingInfo: "Free delivery within 2-3 business days",
          isActive: true,
        });
      }
    }
  }, [isOpen, isEdit, initialProduct, reset]);

  const processFiles = (files: FileList | File[], targetImageId?: string) => {
    setUploadWarning(null);
    const fileArray = Array.from(files);

    // Filter only images
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length < fileArray.length) {
      setUploadWarning(
        "Some non-image files were skipped. Only image files are allowed.",
      );
    }

    if (imageFiles.length === 0) return;

    const currentImages = watchedImages;

    if (isEdit) {
      if (!targetImageId || removeImageIds.includes(targetImageId)) {
        setUploadWarning("Choose an available product image to replace first.");
        return;
      }

      const replacementIndex = replaceImageIds.indexOf(targetImageId);
      const updatedFiles = [...currentImages];
      const updatedIds = [...replaceImageIds];
      const replacementFile = imageFiles[0];

      if (replacementIndex === -1) {
        updatedFiles.push(replacementFile);
        updatedIds.push(targetImageId);
      } else {
        updatedFiles[replacementIndex] = replacementFile;
      }

      setValue("images", updatedFiles, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setReplaceImageIds(updatedIds);
      return;
    }

    const availableSlots = 5 - currentImages.length;

    if (availableSlots <= 0) {
      setUploadWarning(
        "Maximum 5 images reached. Please remove an image before adding new ones.",
      );
      return;
    }

    if (imageFiles.length > availableSlots) {
      setUploadWarning(
        `Only ${availableSlots} more image${availableSlots > 1 ? "s" : ""} could be added (max 5).`,
      );
    }

    const filesToKeep = imageFiles.slice(0, availableSlots);

    const updated = [...currentImages, ...filesToKeep].slice(
      0,
      5 - existingImages.length,
    );
    setValue("images", updated, { shouldValidate: true, shouldDirty: true });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, replacementTargetId.current ?? undefined);
      replacementTargetId.current = null;
      // Reset input value so same files can be re-selected if removed
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = watchedImages.filter((_, idx) => idx !== indexToRemove);
    const updatedReplacementIds = replaceImageIds.filter(
      (_, idx) => idx !== indexToRemove,
    );
    setValue("images", updated, { shouldValidate: true, shouldDirty: true });
    setReplaceImageIds(updatedReplacementIds);
    setUploadWarning(null);
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setRemoveImageIds((current) => [...current, imageId]);
    const replacementIndex = replaceImageIds.indexOf(imageId);
    if (replacementIndex !== -1) handleRemoveImage(replacementIndex);
  };

  const handleRestoreExistingImage = (imageId: string) => {
    setRemoveImageIds((current) => current.filter((id) => id !== imageId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const submitHandler = handleSubmit(async (data) => {
    if (!isEdit && data.images.length === 0) {
      setError("images", {
        type: "manual",
        message: "At least 1 product image is required",
      });
      return;
    }
    try {
      await onSubmit(data, { replaceImageIds, removeImageIds });
      reset();
      onClose();
    } catch {
      // Keep the form values so the user can retry after a failed request.
    }
  });

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
            className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#14151b] border border-[#272935] shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_30px_rgba(124,92,252,0.15)] p-5 sm:p-7"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#21232d]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  {isEdit ? <Edit3 size={16} /> : <Plus size={16} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {isEdit ? "Edit Product Details" : "Create New Product"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {isEdit
                      ? `Updating catalog SKU: ${initialProduct?.sku || ""}`
                      : "Upload files and add a new product to your active store"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Reusable Form */}
            <form
              onSubmit={submitHandler}
              noValidate
              className="mt-5 space-y-4"
            >
              {/* Product Title */}
              <div>
                <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  disabled={isPending}
                  placeholder="e.g. Nike Air Jordan Retro High"
                  {...register("title")}
                  className={`w-full h-10 px-3.5 rounded-xl bg-[#121319] border text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all ${
                    errors.title
                      ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/10"
                      : "border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                  }`}
                />
                <FieldError message={errors.title?.message} />
              </div>

              {/* Brand & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                    Brand
                  </label>
                  <input
                    type="text"
                    disabled={isPending}
                    placeholder="e.g. Acme"
                    {...register("brand")}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#121319] border border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all"
                  />
                  <FieldError message={errors.brand?.message} />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    disabled={isPending}
                    placeholder="e.g. Footwear & Streetwear"
                    {...register("category")}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#121319] border border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Price & Currency & Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                    Price Amount *
                  </label>
                  <input
                    type="number"
                    disabled={isPending}
                    step="any"
                    placeholder="500"
                    {...register("price.amount", { valueAsNumber: true })}
                    className={`w-full h-10 px-3.5 rounded-xl bg-[#121319] border text-sm text-zinc-100 placeholder:text-zinc-500 font-mono outline-none transition-all ${
                      errors.price?.amount
                        ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/10"
                        : "border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                    }`}
                  />
                  <FieldError message={errors.price?.amount?.message} />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                    Currency
                  </label>
                  <select
                    {...register("price.currency")}
                    disabled={isPending}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#121319] border border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40 text-sm text-zinc-100 outline-none transition-all font-mono"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    disabled={isPending}
                    {...register("stock", { valueAsNumber: true })}
                    className={`w-full h-10 px-3.5 rounded-xl bg-[#121319] border text-sm text-zinc-100 placeholder:text-zinc-500 font-mono outline-none transition-all ${
                      errors.stock
                        ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/10"
                        : "border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                    }`}
                  />
                  <FieldError message={errors.stock?.message} />
                </div>
              </div>

              {/* MULTIPLE IMAGE UPLOAD ZONE & PREVIEW */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300 tracking-wide block">
                    Product Images *
                    <span className="text-[11px] text-zinc-400 font-normal ml-1">
                      (Upload up to 5 files, image files only)
                    </span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {isEdit
                      ? existingImages.length - removeImageIds.length
                      : watchedImages.length}{" "}
                    / 5 images
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  disabled={isPending}
                  multiple={!isEdit}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />

                {/* Upload Area / Dropzone */}
                {!isEdit && watchedImages.length < 5 ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200
                      ${
                        isDragging
                          ? "border-[#7c5cfc] bg-purple-500/12 scale-[0.99]"
                          : "border-[#2d3040] hover:border-purple-500/60 bg-[#121319] hover:bg-[#151620]"
                      }
                    `}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto mb-2">
                      <UploadCloud size={20} />
                    </div>
                    <p className="text-xs font-semibold text-white">
                      Click to upload image files or drag & drop here
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Supports PNG, JPG, JPEG, WEBP · Max 5 image files total
                    </p>
                  </div>
                ) : !isEdit ? (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-center text-xs text-purple-300 font-medium">
                    Maximum 5 product images reached. Remove an image below to
                    upload a different one.
                  </div>
                ) : null}

                {/* Warning Message if any */}
                {uploadWarning && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{uploadWarning}</span>
                  </p>
                )}

                {/* Small Image Previews of the Actual Files */}
                {(isEdit
                  ? existingImages.length > 0
                  : watchedImages.length > 0) && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono mb-2">
                      {isEdit ? "Current Product Images" : "Image Previews"}
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {isEdit
                        ? existingImages.map((image, index) => {
                            const imageId = image.publicId;
                            const replacementIndex = imageId
                              ? replaceImageIds.indexOf(imageId)
                              : -1;
                            const replacementFile =
                              watchedImages[replacementIndex];
                            const isRemoved = Boolean(
                              imageId && removeImageIds.includes(imageId),
                            );

                            return (
                              <div
                                key={imageId ?? image.url}
                                className={`relative group aspect-square overflow-hidden rounded-xl border bg-[#0c0d12] p-1 ${
                                  isRemoved
                                    ? "border-rose-500/60 opacity-50"
                                    : "border-[#2c2f3e] hover:border-purple-500/50"
                                }`}
                              >
                                <img
                                  src={
                                    replacementFile
                                      ? getPreviewUrl(replacementFile)
                                      : image.url
                                  }
                                  alt={`Product image ${index + 1}`}
                                  className="h-full w-full rounded-lg object-cover"
                                />
                                {isRemoved && (
                                  <span className="absolute inset-x-1 bottom-1 rounded bg-rose-950/90 px-1 py-1 text-center text-[10px] text-rose-200">
                                    Removed on save
                                  </span>
                                )}
                                {!isRemoved && imageId && (
                                  <div className="absolute inset-x-1 bottom-1 flex gap-1">
                                    <button
                                      type="button"
                                      disabled={isPending}
                                      onClick={() => {
                                        replacementTargetId.current = imageId;
                                        fileInputRef.current?.click();
                                      }}
                                      className="flex-1 rounded bg-black/75 px-1 py-1 text-[10px] text-white"
                                    >
                                      {replacementFile
                                        ? "Change file"
                                        : "Replace"}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isPending}
                                      onClick={() =>
                                        handleRemoveExistingImage(imageId)
                                      }
                                      aria-label={`Remove product image ${index + 1}`}
                                      className="rounded bg-rose-700/90 px-1.5 text-white"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                )}
                                {isRemoved && imageId && (
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() =>
                                      handleRestoreExistingImage(imageId)
                                    }
                                    className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded bg-black/75 px-1 py-1 text-[10px] text-white"
                                  >
                                    <RotateCcw size={11} /> Undo remove
                                  </button>
                                )}
                                {!imageId && (
                                  <span className="absolute inset-x-1 bottom-1 rounded bg-black/75 px-1 py-1 text-center text-[10px] text-zinc-300">
                                    Missing image ID
                                  </span>
                                )}
                              </div>
                            );
                          })
                        : watchedImages.map((image, index) => (
                            <div
                              key={`${image.name}-${image.lastModified}-${index}`}
                              className="relative group aspect-square overflow-hidden rounded-xl border border-[#2c2f3e] bg-[#0c0d12] p-1"
                            >
                              <img
                                src={getPreviewUrl(image)}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full rounded-lg object-cover"
                              />
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleRemoveImage(index)}
                                aria-label={`Remove image ${index + 1}`}
                                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600/90 text-white"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}

                      {!isEdit && watchedImages.length < 5 && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border border-dashed border-[#2f3242] hover:border-purple-400/60 bg-[#121319] hover:bg-[#171822] flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer p-2"
                        >
                          <Plus size={18} className="text-purple-400 mb-1" />
                          <span className="text-[10px] font-medium leading-tight">
                            Add File
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">
                            {5 - watchedImages.length} left
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <FieldError message={errors.images?.message} />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-zinc-300 tracking-wide block mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={2}
                  disabled={isPending}
                  placeholder="Lightweight luxury shoes for premium people..."
                  {...register("description")}
                  className={`w-full p-3 rounded-xl bg-[#121319] border text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all resize-none ${
                    errors.description
                      ? "border-rose-500/70 focus:border-rose-500 bg-rose-950/10"
                      : "border-[#262835] hover:border-[#383a48] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40"
                  }`}
                />
                <FieldError message={errors.description?.message} />
              </div>

              {/* Optional Fields Accordion / Section */}
              <div className="p-3.5 rounded-2xl bg-[#111217] border border-[#20222a] space-y-3">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                  Additional Details (Optional)
                </span>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Key Features
                  </label>
                  <input
                    type="text"
                    disabled={isPending}
                    placeholder="Dual-density air soles, premium perforated leather"
                    {...register("features")}
                    className="w-full h-9 px-3 rounded-lg bg-[#16171f] border border-[#272935] text-xs text-zinc-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1">
                      Return Policy
                    </label>
                    <input
                      type="text"
                      disabled={isPending}
                      placeholder="7-day easy return policy"
                      {...register("returnPolicy")}
                      className="w-full h-9 px-3 rounded-lg bg-[#16171f] border border-[#272935] text-xs text-zinc-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1">
                      Shipping Info
                    </label>
                    <input
                      type="text"
                      disabled={isPending}
                      placeholder="Free express doorstep delivery"
                      {...register("shippingInfo")}
                      className="w-full h-9 px-3 rounded-lg bg-[#16171f] border border-[#272935] text-xs text-zinc-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#14151e] border border-[#252735]">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Catalog Active Status
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    When inactive, buyer storefront displays "Product Not
                    Available" overlay
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={isPending}
                    {...register("isActive")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#262835] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c5cfc]" />
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#21232d] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="py-2.5 px-4 rounded-xl bg-[#20222b] hover:bg-[#282a36] text-xs font-semibold text-zinc-300 transition-colors border border-[#2d303e] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="py-2.5 px-5 rounded-xl bg-[#7c5cfc] hover:bg-[#6c4be8] text-xs font-bold text-white transition-all shadow-[0_4px_16px_rgba(124,92,252,0.3)] cursor-pointer flex items-center gap-1.5"
                >
                  {isPending ? (
                    <Loader size={14} />
                  ) : isEdit ? (
                    <Edit3 size={14} />
                  ) : (
                    <Plus size={14} />
                  )}
                  <span>{isEdit ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
