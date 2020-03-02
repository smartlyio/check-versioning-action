import * as core from "@actions/core";
import * as github from "@actions/github";

const Versions = ["major", "minor", "patch"];
const NoReleaseLabels = ["no release", "norelease", "no_release", "no-release"];

type Label = {
  name: string;
};

async function fetchLabels(client: any, pullRequest: any): Promise<Label[]> {
  try {
    const PRPayload = await client.pulls.get({
      owner: pullRequest.owner,
      repo: pullRequest.repo,
      pull_number: pullRequest.number
    });
    const allLabels: Label[] = PRPayload.data.labels as Label[];
    return allLabels;
  } catch (error) {
    core.setFailed(error.message);
    return [];
  }
}

function filterLabels(allLabels: Label[], labelFilter: string[]): string[] {
  const labels = allLabels
    .map(label => label.name)
    .filter(label => labelFilter.includes(label.toLowerCase()));
  return labels;
}

function warningMessage() {
  return `Invalid version specification!
Please specify one of the following tags:
  major, minor, patch`;
}

export default async function action() {
  try {
    const client = new github.GitHub(core.getInput("GITHUB_TOKEN"));
    const pullRequest = github.context.issue;

    const enforceSet = core.getInput("enforce");

    const allLabels = await fetchLabels(client, pullRequest);
    const versionLabels = filterLabels(allLabels, Versions);
    const noReleaseLabel =
      filterLabels(allLabels, NoReleaseLabels).length === 1;

    let version = ""; // A version need to be give as output
    let continueRelease = "false";

    // No version or too many versions found
    if (versionLabels.length !== 1) {
      console.log(warningMessage());

      if (enforceSet === "true") {
        if (noReleaseLabel) {
          console.log(`
              NO_RELEASE label set, so, this seems like it's intentional, carry on then.
            `);
        } else {
          throw new Error("Invalid version specification");
        }
      } else {
        console.log("NOTE: CURRENT STATE WILL NOT DO A RELEASE");
      }
    } else if (noReleaseLabel) {
      throw new Error(`
        ERROR! Both 'no_release' and a version specified, failing!
      `);
    } else {
      // Just one valid version
      version = versionLabels[0];
      console.log(`Going ahead with version: `, version);
      continueRelease = "true";
    }

    core.setOutput("VERSION_UPPER", version.toUpperCase());
    core.setOutput("VERSION_LOWER", version.toLowerCase());
    core.setOutput("CONTINUE_RELEASE", continueRelease);
  } catch (error) {
    core.setFailed(error.message);
  }
}
