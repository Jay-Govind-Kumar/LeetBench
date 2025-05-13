import express from "express";

const app = express();
app.use(express.json());

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";

// default route
app.get("/", (req, res) => {
  res.send("Hello guys! Welcome to the LeetBench 🔥");
});

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);

export default app;
