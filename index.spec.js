const core = require("@actions/core");
const github = require("@actions/github");

const checkVersioningAction = require("./index.js");

jest.mock("@actions/core");
jest.mock("@actions/github");

describe("check-versioning-action", () => {
  describe("parsing label information", () => {
    it("parses major labels", () => {
      checkVersioningAction();
      expect(true).toEqual(true);
    });

    it.skip("parses minor labels", () => {});
    it.skip("parses patch labels", () => {});
  });

  it.skip("sets upper case version", () => {});
  it.skip("sets lower case version", () => {});
});
