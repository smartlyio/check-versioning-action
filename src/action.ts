import * as core from "@actions/core";
import * as github from "@actions/github";

const Versions = ["major", "minor", "patch"];
const NoReleaseLabels = ["no release", "norelease", "no_release", "no-release"];

type Label = {
  name: string;
};

async function fetchAndFilterLabels(client: any, pullRequest: any): string[] {
  let labels: string[] = []
  try {
      const PRPayload = await client.pulls.get({
            owner: pullRequest.owner,
            repo: pullRequest.repo,
            pull_number: pullRequest.number
        });
      const allLabels = PRPayload.data.labels;
      labels = (allLabels as Label[])
        .map(label => label.name)
        .filter(label => Versions.includes(label.toLowerCase()));
      return labels;
    } catch (error) {
      core.setFailed(error.message);
      return labels;
    }

}

function noReleaseSet(): boolean {
  const labels = (github.context.payload.pull_request
    .labels as Label[]).filter(label =>
    NoReleaseLabels.includes(label.name.toLowerCase())
  );

  return labels.length > 0;
}

function warningMessage() {
  return `Invalid version specification!
Please specify one of the following tags:
  major, minor, patch`;
}

export default async function action() {
  try {

    const client = new github.GitHub(core.getInput('GITHUB_TOKEN'));
    const pullRequest = github.context.issue;

    const enforceSet = core.getInput("enforce");
    const noReleasePermitted = core.getInput("allow_no_release");

    const versionLabels = await fetchAndFilterLabels(client, pullRequest);
    const noReleaseLabel = noReleaseSet();

    let version = ""; // A version need to be give as output

    // No version or too many versions found
    if (versionLabels.length !== 1) {
      console.log(warningMessage());

      if (enforceSet === "true") {
        if (noReleasePermitted === "true" && noReleaseLabel) {
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
    }

    core.setOutput("VERSION_UPPER", version.toUpperCase());
    core.setOutput("VERSION_LOWER", version.toLowerCase());
  } catch (error) {
    core.setFailed(error.message);
  }
}
