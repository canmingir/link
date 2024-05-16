import config from "../../config.js";

describe("OAuth GitHub Login Flow", () => {
  before(() => {
    cy.intercept("POST", "/oauth", {
      body: {
        accessToken: "TEST_ACCESS_TOKEN",
        refreshToken: "TEST_REFRESH_TOKEN",
      },
    }).as("oauthRequest");

    cy.intercept("GET", "https://api.github.com/user", {
      fixture: "/OAUTH/GITHUB/user.json",
    }).as("githubUserRequest");
  });

  it("should when press login button redirect provider url with correct params", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('[data-cy="github-login-button"]').click();

    cy.url().should("include", "https://github.com/login");
    cy.url().should("include", config.login.github.clientId);
    cy.url().should("include", config.login.github.scope);
    cy.url().should("include", config.login.github.response_type);
  });

    cy.checkStorage("dashboard.accessToken", "TEST_ACCESS_TOKEN");
    cy.checkStorage("dashboard.refreshToken", "TEST_REFRESH_TOKEN");
    cy.wait("@githubUserRequest");

    cy.get('[data-cy="user-name"]').should("have.text", "Mock User");
    cy.get('[data-cy="user-avatar"] img').should(
      "have.attr",
      "src",
      "https://avatars.githubusercontent.com/u/134300732?v=4"
    );
  });
});
