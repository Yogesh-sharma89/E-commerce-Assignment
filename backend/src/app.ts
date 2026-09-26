import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import ErrorHandler from "./middleware/errorHandler.js";
import helmet from "helmet";
import httpLogger from "./middleware/httpLogger.js";
import cookieParser from "cookie-parser";
import { globalLimiter } from "./middleware/rate-limit.js";
import productRouter from "./routes/product.route.js";


const app = express();


app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

//cookie-parser 
app.use(cookieParser());


//for logging http request
app.use(httpLogger);


//rate limiter
app.use(globalLimiter)


//routes 
app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);



app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀"
  });
});


//Error-Handler 
app.use(ErrorHandler);


export default app;

