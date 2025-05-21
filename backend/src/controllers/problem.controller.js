import { db } from "../db/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../db/judge0.db.js";

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippet,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to create a problem",
    });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Language: ${language} is not supported`,
        });
      }

      const submission = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submission);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Test case ${i + 1} failed for language ${language}`,
          });
        }
      }

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testCases,
          codeSnippet,
          referenceSolutions,
          userId: req.user.id,
        },
      });
      return res.status(201).json({
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      });
    }
  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllProblems = async (req, res) => {};

const getProblemById = async (req, res) => {};

const updateProblem = async (req, res) => {};

const deleteProblem = async (req, res) => {};

const getAllProblemsSolvedByUser = async (req, res) => {};

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
};
