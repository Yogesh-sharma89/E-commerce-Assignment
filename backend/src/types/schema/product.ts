import type { Document, Types } from "mongoose";

export interface IPRODUCT extends Document{
 
    title:string,
    description:string,
    price:{
        amount:number,
        currency:string
    },
    images:IPRODUCTMEDIA[],
    sku:string //stock keeping unit
    slug:string,
    brand?:string,
    stock:number,
    isActive:boolean,
    category?:string,

    features?:string,
    returnPolicy?:string,
    shippingInfo?:string

}

export interface IPRODUCTMEDIA extends Document{
    product:Types.ObjectId,
    url:string,
    type:string,
    publicId?:string,
    thumbnailUrl?:string
}