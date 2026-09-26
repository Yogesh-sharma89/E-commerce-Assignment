import { Router } from "express";
import { CreateProduct, DeleteProduct, GetAllproducts, GetProductById, UpdateProduct } from "../controller/product.controller.js";

const productRouter = Router();

//public routes 
productRouter.get("/",GetAllproducts);
productRouter.get("/:id",GetProductById)

//protectedRoutes 
productRouter.post("/",CreateProduct);
productRouter.delete("/:id",DeleteProduct);
productRouter.put("/:id",UpdateProduct)

export default productRouter;