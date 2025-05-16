import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// load environment variables from .env file
dotenv.config({
  path: "./.env",
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";

// default route
app.get("/", (req, res) => {
  res.send("Hello guys! Welcome to the LeetBench 🔥");
});

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);

export default app;
