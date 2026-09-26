import { Router } from "express";
import { CreateProduct, DeleteProduct, GetAllproducts, GetProductById, UpdateProduct } from "../controller/product.controller.js";
import ProtectRoutes from "../middleware/auth.middleware.js";
import checkSeller from "../middleware/seller.js";
import upload from "../middleware/upload.js";

const productRouter = Router();

//public routes 
productRouter.get("/",GetAllproducts);
productRouter.get("/:id",GetProductById)

//protectedRoutes 
productRouter.use(ProtectRoutes);
productRouter.use(checkSeller)

productRouter.post("/",upload.array("images",5),CreateProduct);
productRouter.delete("/:id",DeleteProduct);
productRouter.put("/:id",upload.array("images",5),UpdateProduct)

export default productRouter;