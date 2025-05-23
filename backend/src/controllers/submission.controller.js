import { db } from "../db/db.js";

const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No submissions found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions: submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const submissions = db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No submissions found for this problem",
      });
    }
    // Assuming we want to fetch the latest submission for the problem
    const latestSubmission = submissions[0];

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submission: latestSubmission,
    });
  } catch (error) {
    console.error("Error fetching submission for problem:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submissions = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No submissions found for this problem",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions: submissions,
    });
  } catch (error) {
    console.error("Error fetching all submissions for problem:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  getAllSubmissions,
  getSubmissionForProblem,
  getAllSubmissionsForProblem,
};
