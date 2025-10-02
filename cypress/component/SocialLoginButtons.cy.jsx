import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import SocialLoginButtons from "../../src/components/SocialLoginButtons/SocialLoginButtons";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

describe("SocialLoginButtons Component", () => {
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onGoogle: cy.stub().as("googleCallback"),
      onGithub: cy.stub().as("githubCallback"),
      onLinkedin: cy.stub().as("linkedinCallback"),
    };
  });

  describe("Rendering Tests", () => {
    it("should render all social login buttons when all are enabled", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={true}
            githubEnable={true}
            linkedinEnable={true}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("be.visible");
      cy.contains("Continue with Google").should("be.visible");
      cy.contains("Continue with LinkedIn").should("be.visible");
    });

    it("should render only GitHub button when only GitHub is enabled", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={false}
            githubEnable={true}
            linkedinEnable={false}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("be.visible");
      cy.contains("Continue with Google").should("not.exist");
      cy.contains("Continue with LinkedIn").should("not.exist");
    });

    it("should render only Google button when only Google is enabled", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={true}
            githubEnable={false}
            linkedinEnable={false}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with Google").should("be.visible");
      cy.contains("Continue with GitHub").should("not.exist");
      cy.contains("Continue with LinkedIn").should("not.exist");
    });

    it("should render only LinkedIn button when only LinkedIn is enabled", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={false}
            githubEnable={false}
            linkedinEnable={true}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with LinkedIn").should("be.visible");
      cy.contains("Continue with GitHub").should("not.exist");
      cy.contains("Continue with Google").should("not.exist");
    });

    it("should render no buttons when all are disabled", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={false}
            githubEnable={false}
            linkedinEnable={false}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("not.exist");
      cy.contains("Continue with Google").should("not.exist");
      cy.contains("Continue with LinkedIn").should("not.exist");
    });
  });

  describe("Interaction Tests", () => {
    beforeEach(() => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={true}
            githubEnable={true}
            linkedinEnable={true}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );
    });

    it("should call onGithub callback when GitHub button is clicked", () => {
      cy.contains("Continue with GitHub").click();
      cy.get("@githubCallback").should("have.been.calledOnce");
    });

    it("should call onGoogle callback when Google button is clicked", () => {
      cy.contains("Continue with Google").click();
      cy.get("@googleCallback").should("have.been.calledOnce");
    });

    it("should call onLinkedin callback when LinkedIn button is clicked", () => {
      cy.contains("Continue with LinkedIn").click();
      cy.get("@linkedinCallback").should("have.been.calledOnce");
    });

    it("should handle multiple clicks correctly", () => {
      cy.contains("Continue with GitHub").click().click();
      cy.get("@githubCallback").should("have.been.calledTwice");

      cy.contains("Continue with Google").click();
      cy.get("@googleCallback").should("have.been.calledOnce");
      cy.get("@githubCallback").should("have.been.calledTwice");
    });
  });

  describe("Accessibility and Data Attributes", () => {
    it("should have proper data-cy attribute for GitHub button", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            githubEnable={true}
            onGithub={mockCallbacks.onGithub}
          />
        </TestWrapper>
      );

      cy.get('[data-cy="github-login-button"]').should("exist");
      cy.get('[data-cy="github-login-button"]').should(
        "contain",
        "Continue with GitHub"
      );
    });

    it("should have accessible button text", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={true}
            githubEnable={true}
            linkedinEnable={true}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("match", "button");
      cy.contains("Continue with Google").should("match", "button");
      cy.contains("Continue with LinkedIn").should("match", "button");

      cy.contains("Continue with GitHub")
        .should("be.visible")
        .and("not.be.empty");
      cy.contains("Continue with Google")
        .should("be.visible")
        .and("not.be.empty");
      cy.contains("Continue with LinkedIn")
        .should("be.visible")
        .and("not.be.empty");
    });
  });

  describe("Visual and Styling Tests", () => {
    beforeEach(() => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={true}
            githubEnable={true}
            linkedinEnable={true}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );
    });

    it("should display correct icons for each button", () => {
      cy.contains("Continue with GitHub").find("svg").should("exist");

      cy.contains("Continue with Google").find("svg").should("exist");

      cy.contains("Continue with LinkedIn").find("svg").should("exist");
    });

    it("should have proper button variants", () => {
      cy.contains("Continue with GitHub").should(
        "have.class",
        "MuiButton-contained"
      );

      cy.contains("Continue with Google").should(
        "have.class",
        "MuiButton-contained"
      );

      cy.contains("Continue with LinkedIn").should(
        "have.class",
        "MuiButton-contained"
      );
    });

    it("should apply custom styling to buttons", () => {
      cy.contains("Continue with GitHub")
        .should("have.css", "background-color")
        .and("include", "51, 51, 51");

      cy.contains("Continue with Google")
        .should("have.css", "background-color")
        .and("include", "255, 255, 255");

      cy.contains("Continue with LinkedIn")
        .should("have.css", "background-color")
        .and("include", "0, 119, 181");
    });

    it("should have proper button widths", () => {
      cy.contains("Continue with GitHub").should("have.css", "width", "500px");

      cy.contains("Continue with Google").should("have.css", "width", "500px");

      cy.contains("Continue with LinkedIn").should(
        "have.css",
        "width",
        "500px"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined callbacks gracefully", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons githubEnable={true} onGithub={undefined} />
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("be.visible");

      cy.contains("Continue with GitHub").click();
    });

    it("should handle missing props gracefully", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons />
        </TestWrapper>
      );

      cy.get("body").should("not.contain", "Continue with");
    });

    it("should work with mixed enable states", () => {
      cy.mount(
        <TestWrapper>
          <SocialLoginButtons
            googleEnable={true}
            githubEnable={false}
            linkedinEnable={true}
            onGoogle={mockCallbacks.onGoogle}
            onGithub={mockCallbacks.onGithub}
            onLinkedin={mockCallbacks.onLinkedin}
          />
        </TestWrapper>
      );

      cy.contains("Continue with Google").should("be.visible");
      cy.contains("Continue with GitHub").should("not.exist");
      cy.contains("Continue with LinkedIn").should("be.visible");

      cy.contains("Continue with Google").click();
      cy.contains("Continue with LinkedIn").click();

      cy.get("@googleCallback").should("have.been.calledOnce");
      cy.get("@linkedinCallback").should("have.been.calledOnce");
      cy.get("@githubCallback").should("not.have.been.called");
    });
  });

  describe("Component Integration", () => {
    it("should work within a form context", () => {
      cy.mount(
        <TestWrapper>
          <form>
            <SocialLoginButtons
              githubEnable={true}
              onGithub={mockCallbacks.onGithub}
            />
          </form>
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("be.visible");
      cy.contains("Continue with GitHub").click();
      cy.get("@githubCallback").should("have.been.calledOnce");
    });

    it("should maintain state across re-renders", () => {
      const TestComponent = () => {
        const [githubEnabled, setGithubEnabled] = React.useState(true);

        return (
          <div>
            <button onClick={() => setGithubEnabled(!githubEnabled)}>
              Toggle GitHub
            </button>
            <SocialLoginButtons
              githubEnable={githubEnabled}
              onGithub={mockCallbacks.onGithub}
            />
          </div>
        );
      };

      cy.mount(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      cy.contains("Continue with GitHub").should("be.visible");

      cy.contains("Toggle GitHub").click();
      cy.contains("Continue with GitHub").should("not.exist");

      cy.contains("Toggle GitHub").click();
      cy.contains("Continue with GitHub").should("be.visible");
    });
  });
});
