import config from "../../config.js";

describe("OAuth GitHub", () => {
  it("should when press login button redirect provider url with correct params", () => {
    cy.visit("/login");

    cy.get('[data-cy="github-login-button"]').click();

    cy.url().should("include", "https://github.com/login");
    cy.url().should("include", config.login.github.clientId);
    cy.url().should("include", config.login.github.scope);
    cy.url().should("include", config.login.github.response_type);
  });

  it("should user after login redirect homepage and display user info", () => {
    cy.intercept("POST", "/oauth", {
      body: {
        accessToken: "TEST_ACCESS_TOKEN",
        refreshToken: "TEST_REFRESH_TOKEN",
      },
    }).as("oauthRequest");

    cy.intercept("GET", "https://api.github.com/user", {
      fixture: "/OAUTH/GITHUB/user.json",
    }).as("githubUserRequest");

    cy.visit("/callback?code=TEST_CODE");

    cy.wait("@oauthRequest");
    cy.wait("@githubUserRequest");

    cy.getBySel("account-popover").click();
    cy.getBySel("account-popover-name").contains("octocat");
  });
});
