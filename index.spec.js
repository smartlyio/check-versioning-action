const core = require("@actions/core");
const github = require("@actions/github");

const checkVersioningAction = require("./index.js");

jest.mock("@actions/core");
jest.mock("@actions/github");

function createLabel(label) {
  return {
    color: "0b7f73",
    default: false,
    description: "",
    id: 1,
    name: label,
    node_id: "MDU6TGFiZWwxNzM2OTY3MDE1",
    url: `https://api.github.com/repos/smartlyio/ci-sla/labels/${label}`
  };
}

describe("check-versioning-action", () => {
  describe("parsing label information", () => {
    it("parses major labels", () => {
      github.context.payload = {
        pull_request: {
          labels: [createLabel("major")]
        }
      };

      checkVersioningAction();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MAJOR");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "major");
    });

    it("parses minor labels", () => {
      github.context.payload = {
        pull_request: {
          labels: [createLabel("minor")]
        }
      };

      checkVersioningAction();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MINOR");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "minor");
    });

    it("parses patch labels", () => {
      github.context.payload = {
        pull_request: {
          labels: [createLabel("patch")]
        }
      };

      checkVersioningAction();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "PATCH");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "patch");
    });

    it("throws an error with multiple labels", () => {
      github.context.payload = {
        pull_request: {
          labels: [createLabel("patch"), createLabel("minor")]
        }
      };

      core.getInput.mockReturnValue("true");
      checkVersioningAction();
      expect(core.setFailed).toHaveBeenCalled();
    });
  });
});
