/* eslint-disable */
import * as github from "@actions/github";

type Label = {
  name: string;
};

export default async function fetchLabels(
  pullRequest: any
): Promise<Label[]> {
  const client = github.getOctokit(core.getInput("GITHUB_TOKEN"));

  const PRPayload = await client.rest.pulls.get({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number,
  });
  const allLabels: Label[] = PRPayload.data.labels as Label[];
  return allLabels;
}
