import { Router } from "express";
import { authAdmin, authToken } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
} from "../controllers/problem.controller.js";

const problemRouter = Router();

problemRouter.post("/create-problem", authToken, authAdmin, createProblem);
problemRouter.get("/get-all-problems", authToken, getAllProblems);
problemRouter.get("/get-problem/:id", authToken, getProblemById);
problemRouter.put("/update-problem/:id", authToken, authAdmin, updateProblem);
problemRouter.delete(
  "/delete-problem/:id",
  authToken,
  authAdmin,
  deleteProblem,
);
problemRouter.get(
  "/get-solved-problems",
  authToken,
  getAllProblemsSolvedByUser,
);

export default problemRouter;
