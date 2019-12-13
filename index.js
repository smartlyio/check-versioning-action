const core = require('@actions/core');
const github = require('@actions/github');

try {
  // Inputs
  const enforceSet = core.getInput('enforce');

  // Predefining default outputs
  let VERSION_UPPER = '';
  let VERSION_LOWER = '';

  //Let's get the list of labels
  const label_array = github.context.payload.pull_request.labels.map(a => a.name);
  const majorLabel = label_array.includes('major');
  const minorLabel = label_array.includes('minor');
  const patchLabel = label_array.includes('patch');

  if (majorLabel === true && minorLabel === false && patchLabel === false) {
    VERSION_UPPER = 'MAJOR';
  } else if (majorLabel === false && minorLabel === true && patchLabel === false) {
    VERSION_UPPER = 'MINOR';
  } else if (majorLabel === false && minorLabel === false && patchLabel === true) {
    VERSION_UPPER = 'PATCH';
  } else {
    console.log('Invalid version specification!');
    console.log('Please specify one of the following tags:');
    console.log('   major, minor, patch');
    if (enforceSet === 'true') {
      throw new Error('Invalid Verions specification');
    } else {
      console.log('NOTE: CURRENT STATE WILL NOT DO A RELEASE');
    }
  }
  // Set the version lower as we'll need that too
  VERSION_LOWER = VERSION_UPPER.toLowerCase();
  // Return values for use in next step
  core.setOutput('VERSION_UPPER', VERSION_UPPER);
  core.setOutput('VERSION_LOWER', VERSION_LOWER);

} catch (error) {
  core.setFailed(error.message);
}
