module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(888);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 29:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 870:
/***/ (function() {

eval("require")("@actions/github");


/***/ }),

/***/ 888:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(29);
const github = __webpack_require__(870);

const Versions = ['major', 'minor', 'patch'];

function fetchAndFilterLabels() {
  const labels = github.context.payload.pull_request.labels.filter(
    (label) =>
      Versions.includes(label.toLowerCase())
  );

  return labels;
}

function warningMessage() {
  return `Invalid version specification!
Please specify one of the following tags:
  major, minor, patch`;
}

try {
  const enforceSet = core.getInput('enforce');

  let versionLabels = fetchAndFilterLabels();

  let version = ''; // A version need to be give as output

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
  }

  core.setOutput('VERSION_UPPER', version.toUpperCase());
  core.setOutput('VERSION_LOWER', version.toLowerCase());

} catch (error) {
  core.setFailed(error.message);
}


/***/ })

/******/ });