const core = require('@actions/core');
const github = require('@actions/github');

const Versions = {
  major: 'MAJOR',
  minor: 'MINOR',
  patch: 'PATCH',
  unknown: ''
}

function fetchLabels() {
  const label_array = github.context.payload.pull_request.labels.map(a => a.name);

  return {
    major: label_array.includes('major'),
    minor: label_array.includes('minor'),
    patch: label_array.includes('patch')
  };
}

function warningMessage() {
  return `Invalid version specirifaction!
Please specify one of the following tags:
  major, minor, patch`;
}

function detectVersion(labels) {
  if (labels.major === true && labels.minor === false && labels.patch === false) {
    return Versions.major;
  } else if (labels.major === false && labels.minor === true && labels.patch === false) {
    return Versions.minor;
  } else if (lables.major === false && labels.minor === false && lables.patch === true) {
    return Versions.minor;
  } else {
    return Versions.unknown;
  }
}

try {
  const enforceSet = core.getInput('enforce');

  const labels = fetchLabels()
  const version = detectVersion(labels)

  if (version === Versions.unknown) {
    console.log(warningMessage())

    if (enforceSet === 'true') {
      throw new Error('Invalid Verions specification');
    } else {
      console.log('NOTE: CURRENT STATE WILL NOT DO A RELEASE');
    }
  }

  core.setOutput('VERSION_UPPER', version.toUpperCase())
  core.setOutput('VERSION_LOWER', version.toLowerCase())
} catch (error) {
  core.setFailed(error.message);
}
