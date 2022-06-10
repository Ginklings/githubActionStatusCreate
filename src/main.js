const core = require("@actions/core");
const { createStatusCheck, createPrComment } = require("./github");
const { getMarkupForJson } = require("./markup");

const requiredArgOptions = {
  required: true,
  trimWhitespace: true,
};

const token = core.getInput("github-token", requiredArgOptions);
const userMessage = core.getInput("message", requiredArgOptions);
const totalTests = core.getInput("total-tests", requiredArgOptions);
const failedTests = core.getInput("failed-tests", requiredArgOptions);
const reportName = core.getInput("status-name", requiredArgOptions);
const ignoreTestFailures = core.getInput("ignore-test-failures") == "true";
const shouldCreateStatusCheck = core.getInput("create-status-check") == "true";
const shouldCreatePRComment = core.getInput("create-pr-comment") == "true";
const updateCommentIfOneExists =
  core.getInput("update-comment-if-one-exists") == "true";

async function run() {
  try {
    const resultsJson = {
      stats: {
        total: totalTests,
        failed: failedTests,
      },
      message: userMessage,
    };

    const markupData = getMarkupForJson(resultsJson, reportName);

    let conclusion = "success";
    if (failedTests > 0) {
      core.warning(`At least one failure was found.`);
      conclusion = ignoreTestFailures ? "neutral" : "failure";
    } else {
      core.info(`There are no failures.`);
    }

    if (shouldCreateStatusCheck) {
      await createStatusCheck(token, markupData, conclusion, reportName);
    }
    if (shouldCreatePRComment) {
      await createPrComment(token, markupData, updateCommentIfOneExists);
    }

    core.setOutput("test-outcome", resultsJson.outcome);
  } catch (error) {
    if (error instanceof RangeError) {
      core.info(error.message);
      core.setOutput("test-outcome", "Failed");
      return;
    } else {
      core.setFailed(
        `An error occurred processing results file: ${error.message}`
      );
      core.setOutput("test-outcome", "Failed");
    }
  }
}

run();
