/* eslint-disable */
import * as core from "@actions/core";
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
  const pullRequests =
    await client.rest.repos.listPullRequestsAssociatedWithCommit({
      commit_sha: context.sha,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

  core.info(pullRequests.data)
  if (pullRequests.data.length !== 1) {
    core.warning(
      `Multiple PRs associated with the current commit sha! Please provide a unique sha (avoid cherry-picking and creating branches off of branches).`
    );
    throw new Error("Ambiguous commit sha");
  }

  return pullRequests.data[0].number;
}
