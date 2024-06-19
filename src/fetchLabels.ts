/* eslint-disable */
import * as github from "@actions/github";

type Label = {
  name: string;
};

export default async function fetchLabels(
  token: string,
  context: any
): Promise<Label[]> {
  const client = github.getOctokit(token);

  const payload = await client.rest.pulls.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    pull_number: context.issue.number,
  });
  const allLabels: Label[] = payload.data.labels as Label[];
  return allLabels;
}
