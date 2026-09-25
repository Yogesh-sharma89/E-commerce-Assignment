import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import ErrorHandler from "./middleware/errorHandler.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes 
app.use("/api/auth",authRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀"
  });
});


//Error-Handler 
app.use(ErrorHandler);


export default app;

