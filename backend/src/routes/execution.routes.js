import { Router } from "express";
import { authToken } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/execution.controller.js";

const executionRouter = Router();

executionRouter.post("/", authToken, executeCode);

export default executionRouter;
