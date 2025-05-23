import { Router } from "express";
import {
  getAllSubmissions,
  getSubmissionForProblem,
  getAllSubmissionsForProblem,
} from "../controllers/submission.controller.js";
import { authToken } from "../middlewares/auth.middleware.js";

const submissionRouter = Router();

submissionRouter.get("/get-all-submissions", authToken, getAllSubmissions);
submissionRouter.get(
  "/get-submission/:problemID",
  authToken,
  getSubmissionForProblem,
);
submissionRouter.get(
  "/get-submissions-count/:problemID",
  authToken,
  getAllSubmissionsForProblem,
);

export default submissionRouter;
