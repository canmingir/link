describe("OAuth GitHub Login Flow", () => {
  before(() => {
    cy.viewport(window.top.innerWidth, window.top.innerHeight);
    cy.intercept("POST", "/oauth", {
      body: {
        access_token: "TEST_ACCESS_TOKEN",
        refresh_token: "TEST_REFRESH_TOKEN",
      },
    }).as("oauthRequest");
    cy.intercept("GET", "https://api.github.com/user", {
      statusCode: 200,
      body: {
        id: 1,
        login: "test",
        avatar_url: "https://avatars.githubusercontent.com/u/134300732?v=4",
        name: "Mock User",
      },
    }).as("githubUserRequest");
  });

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit("http://localhost:5173/login");
  });

  it("should perform OAuth login with GitHub successfully", () => {
    cy.get('[data-cy="github-login-button"]').click();
    cy.visit("http://localhost:5173/callback?code=TEST_CODE");

    cy.wait("@oauthRequest")
      .its("request.body")
      .should("deep.eq", { code: "TEST_CODE" });

    cy.url().should("include", "/");

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
