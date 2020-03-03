type Label = {
  name: string;
};

export default async function fetchLabels(
  client: any,
  pullRequest: any
): Promise<Label[]> {
  const PRPayload = await client.pulls.get({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    pull_number: pullRequest.number
  });
  const allLabels: Label[] = PRPayload.data.labels as Label[];
  return allLabels;
}
