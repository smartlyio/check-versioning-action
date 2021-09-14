import * as core from "@actions/core";
import * as github from "@actions/github";

import action from "./action";

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

jest.mock("@actions/core");
jest.mock("@actions/github");

let labels: Array<{ name: string }> = null;
jest.mock("./fetchLabels", () => async () => Promise.resolve(labels));

describe("check-versioning-action", () => {
  describe("parsing label information", () => {
    afterEach(() => {
      labels = null;
    });

    it("parses major labels", async () => {
      labels = [createLabel("major")];
      await action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MAJOR");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "major");
    });

    it("parses minor labels", async () => {
      labels = [createLabel("minor")];

      await action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MINOR");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "minor");
    });

    it("parses patch labels", async () => {
      labels = [createLabel("patch")];
      await action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "PATCH");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "patch");
    });

    it("Fails if both version and 'no release' are set", async () => {
      labels = [createLabel("patch"), createLabel("no_release")];

      await action();
      expect(core.setFailed).toHaveBeenCalled();
    });

    it("sets empty version when there are multiple labels", async () => {
      labels = [createLabel("patch"), createLabel("minor")];

      await action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "");
    });

    it("sets empty version when there are no labels", async () => {
      labels = [];

      await action();
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "");
      expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "");
    });

    describe("with enforce true", () => {
      it("sets failed message when using with multiple labels", async () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: [createLabel("patch"), createLabel("minor")]
          }
        };

        (core.getInput as jest.Mock).mockReturnValue("true");
        await action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("sets failed message when there are no labels", async () => {
        labels = [];
        // (core.getInput as jest.Mock).mockReturnValueOnce("true");
        // (core.getInput as jest.Mock).mockReturnValueOnce("false");
        await action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("sets failed message when there are no labels, even if the no-release option is set.", async () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: []
          }
        };

        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        await action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("sets failed message when there are no labels, even if the no-release label is set.", async () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: [createLabel("no_release")]
          }
        };

        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        (core.getInput as jest.Mock).mockReturnValueOnce("false");
        await action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("Fails if both version and no release set without allowing label", async () => {
        github.context.payload = {
          pull_request: {
            number: 1,
            labels: [createLabel("minor"), createLabel("no_release")]
          }
        };

        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        (core.getInput as jest.Mock).mockReturnValueOnce("false");
        await action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("Fails if both version and no release set with allowing label", async () => {
        labels = [createLabel("minor"), createLabel("no_release")];

        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        await action();
        expect(core.setFailed).toHaveBeenCalled();
      });

      it("parses minor labels", async () => {
        labels = [createLabel("minor")];

        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        await action();
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "MINOR");
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "minor");
      });

      it("Accepts no release when properly configured", async () => {
        labels = [createLabel("no_release")];

        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        await action();
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "");
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "");
      });

      it("Accepts no release when properly configured 2", async () => {
        labels = [createLabel("no release")];
        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        (core.getInput as jest.Mock).mockReturnValueOnce("true");
        await action();
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_UPPER", "");
        expect(core.setOutput).toHaveBeenCalledWith("VERSION_LOWER", "");
        expect(core.setOutput).toHaveBeenCalledWith(
          "CONTINUE_RELEASE",
          "false"
        );
      });
    });
  });
});
