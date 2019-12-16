import * as core from "@actions/core";
import * as github from "@actions/github";

import action from "./action";

jest.mock("@actions/core");
jest.mock("@actions/github");

function createLabel(label: string) {
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
          number: 1,
          labels: [createLabel("major")]
        }
      };

      action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MAJOR");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "major");
    });

    it("parses minor labels", () => {
      github.context.payload = {
        pull_request: {
          number: 1,
          labels: [createLabel("minor")]
        }
      };

      action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MINOR");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "minor");
    });

    it("parses patch labels", () => {
      github.context.payload = {
        pull_request: {
          number: 1,
          labels: [createLabel("patch")]
        }
      };

      action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "PATCH");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "patch");
    });

    it("sets empty version when there are multiple labels", () => {
      github.context.payload = {
        pull_request: {
          number: 1,
          labels: [createLabel("patch"), createLabel("minor")]
        }
      };

      action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "");
    });

    it("sets empty version when there are no labels", () => {
      github.context.payload = {
        pull_request: {
          number: 1,
          labels: []
        }
      };

      action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "");
    });

    describe("with enforce true", () => {
      it("sets failed message when using with multiple labels", () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: [createLabel("patch"), createLabel("minor")]
          }
        };

        (core.getInput as jest.Mock).mockReturnValue("true");
        action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("sets failed message when there are no labels", () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: []
          }
        };

        (core.getInput as jest.Mock).mockReturnValue("true");
        action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("parses minor labels", () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: [createLabel("minor")]
          }
        };

        action();
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MINOR");
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "minor");
      });

    });
  });
});
