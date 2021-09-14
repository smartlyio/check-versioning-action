import * as core from "@actions/core";
import * as github from "@actions/github";
import fetchLabels from "./fetchLabels";

const Versions = ["major", "minor", "patch"];
const NoReleaseLabels = ["no release", "norelease", "no_release", "no-release"];

type Label = {
  name: string;
};

function filterLabels(allLabels: Label[], labelFilter: string[]): string[] {
  const labels = allLabels
    .map((label) => label.name)
    .filter((label) => labelFilter.includes(label.toLowerCase()));
  return labels;
}

function warningMessage(): string {
  return `Invalid version specification!
Please specify one of the following tags:
  major, minor, patch`;
}

export default async function action(): Promise<void> {
  try {
    const pullRequest = github.context.issue;

    const token = core.getInput("GITHUB_TOKEN");
    const enforceSet = core.getInput("enforce");

    const allLabels = await fetchLabels(token, pullRequest);
    const versionLabels = filterLabels(allLabels, Versions);
    const noReleaseLabel =
      filterLabels(allLabels, NoReleaseLabels).length === 1;

    let version = ""; // A version need to be give as output
    let continueRelease = "false";

    // No version or too many versions found
    if (versionLabels.length !== 1) {
      core.warning(warningMessage());

      if (enforceSet === "true") {
        if (noReleaseLabel) {
          core.info(`
              NO_RELEASE label set, so, this seems like it's intentional, carry on then.
            `);
        } else {
          throw new Error("Invalid version specification");
        }
      } else {
        core.warning("NOTE: CURRENT STATE WILL NOT DO A RELEASE");
      }
    } else if (noReleaseLabel) {
      throw new Error(`
        ERROR! Both 'no_release' and a version specified, failing!
      `);
    } else {
      // Just one valid version
      version = versionLabels[0];
      core.info(`Going ahead with version: ${version}`);
      continueRelease = "true";
    }

    core.setOutput("VERSION_UPPER", version.toUpperCase());
    core.setOutput("VERSION_LOWER", version.toLowerCase());
    core.setOutput("CONTINUE_RELEASE", continueRelease);
  } catch (error) {
    core.error(`${error}`);
    core.setFailed(`${error}`);
  }
}
