import { db } from "../db/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../db/judge0.db.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid or Missing Testcases",
      });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Send batch submission to Judge0
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((response) => response.token);

    // Poll for results
    const results = await pollBatchResults(tokens);
    console.log("Results: ", results);

    // Analyze testcase results
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expectedOutput = expected_outputs[i]?.trim();
      const passed = stdout === expectedOutput;

      if (!passed) {
        allPassed = false;
      }
      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expectedOutput,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} sec` : undefined,
      };
    });

    console.log("Detailed Results: ", detailedResults);

    // Save results to the database
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // If all passed, mark the problem as solved for the user
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        create: {
          userId,
          problemId,
        },
        update: {},
      });
    }

    // Save individual results to the database
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    // Send response
    res.status(200).json({
      status: true,
      message: "Code executed successfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
