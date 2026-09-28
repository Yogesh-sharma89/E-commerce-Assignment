export type ProductCurrency = "INR" | "USD" | "PKR" | "JPY";

export interface ProductMedia {
  url: string;
  type: "image" | "video";
  publicId?: string;
  thumbnailUrl?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: ProductCurrency;
  };
  images: ProductMedia[];
  sku: string;
  slug: string;
  brand?: string;
  stock: number;
  isActive: boolean;
  category?: string;
  features?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}