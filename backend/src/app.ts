import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import ErrorHandler from "./middleware/errorHandler.js";
import helmet from "helmet";
import httpLogger from "./middleware/httpLogger.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import { fileURLToPath } from "url";
import path from "path";
import EnvConfig from "./config/env.config.js";


const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();


app.use(helmet({
  contentSecurityPolicy:false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (EnvConfig.environment !== 'production') {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true
    })
  );
}

//cookie-parser 
app.use(cookieParser());


//for logging http request
app.use(httpLogger);


//routes 
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);


app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀"
  });
});

//Fronted server 
const frontendPath = path.resolve(_dirname, "../../frontend/dist")

app.use(express.static(frontendPath));


app.use((req, res, next) => {

  if (req.method !== "GET") {
    return next();
  }

  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"))
})


//Error-Handler 
app.use(ErrorHandler);


export default app;

