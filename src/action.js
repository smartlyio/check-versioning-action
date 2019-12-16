const core = require("@actions/core");
const github = require("@actions/github");

const Versions = ["major", "minor", "patch"];

function fetchAndFilterLabels() {
  const labels = github.context.payload.pull_request.labels
    .map(label => label.name)
    .filter(label => Versions.includes(label.toLowerCase()));

  return labels;
}

function warningMessage() {
  return `Invalid version specification!
Please specify one of the following tags:
  major, minor, patch`;
}

module.exports = () => {
  try {
    const enforceSet = core.getInput("enforce");

    const versionLabels = fetchAndFilterLabels();

    let version = ""; // A version need to be give as output

    // No version or too many versions found
    if (versionLabels.length !== 1) {
      console.log(warningMessage());

      if (enforceSet === "true") {
        throw new Error("Invalid version specification");
      } else {
        console.log("NOTE: CURRENT STATE WILL NOT DO A RELEASE");
      }
    } else {
      // Just one valid version
      version = versionLabels[0];
    }

    core.setOutput("VERSION_UPPER", version.toUpperCase());
    core.setOutput("VERSION_LOWER", version.toLowerCase());
  } catch (error) {
    core.setFailed(error.message);
  }
};
