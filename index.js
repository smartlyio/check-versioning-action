const core = require('@actions/core');
const github = require('@actions/github');

const Versions = ['major', 'minor', 'patch'];

function fetchAndFilterLabels() {
  const labels = github.context.payload.pull_request.labels.filter(
    (label) =>
      Versions.includes(label.name.toLowerCase())
  );

  const labelNames = labels.map(label => label.name);

  return labelNames;
}

function warningMessage() {
  return `Invalid version specification!
Please specify one of the following tags:
  major, minor, patch`;
}

try {
  const enforceSet = core.getInput('enforce');

  const versionLabels = fetchAndFilterLabels();

  let version = ''; // A version needs to be given as output

  // No version or too many versions found
  if (versionLabels.length !== 1) {
    console.log(warningMessage());

    if (enforceSet === 'true') {
      throw new Error('Invalid version specification');
    } else {
      console.log('NOTE: CURRENT STATE WILL NOT DO A RELEASE');
    }
  }
  // Just one valid version
  else {
    version = versionLabels[0];
    console.log(`Setting version to: ${version}`);
  }

  core.setOutput('VERSION_UPPER', version.toUpperCase());
  core.setOutput('VERSION_LOWER', version.toLowerCase());

} catch (error) {
  core.setFailed(error.message);
}
