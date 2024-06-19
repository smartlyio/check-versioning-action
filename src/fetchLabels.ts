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

  const payload = await getPayload(client, context);
  const allLabels: Label[] = payload.data.labels as Label[];
  return allLabels;
}

async function getPayload(client: any, context: any) {
  if (context.eventName === "push") {
    return await client.rest.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: await getPullNumber(client, context),
    });
  }
  return await client.rest.pulls.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    pull_number: context.issue.number,
  });
}

async function getPullNumber(client: any, context: any) {
  return (
    await client.rest.repos.listPullRequestsAssociatedWithCommit({
      commit_sha: context.sha,
      owner: context.repo.owner,
      repo: context.repo.repo,
    })
  ).data[0].number;
}
