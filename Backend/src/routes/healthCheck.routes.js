import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controllers.js";

const router = Router();

router.get("/", healthCheck);

export default router;
