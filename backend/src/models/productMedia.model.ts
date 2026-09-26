import mongoose from "mongoose";
import type { IPRODUCTMEDIA } from "../types/schema/product.js";

const productMediaSchema = new mongoose.Schema<IPRODUCTMEDIA>({


    url:{
        type:String,
        required:[true,"Product media url is required"],
        trim:true,
    },
    type:{
        type:String,
        enum:["image","video"],
        default:"image"
    },
    publicId:{type:String,trim:true},
    thumbnailUrl:{type:String,trim:true}

},{
    _id:false
})

export default productMediaSchema;