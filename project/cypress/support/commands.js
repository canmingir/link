// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("checkStorage", (key, expectedValue) => {
  cy.window().should((win) => {
    const actualValue = win.localStorage.getItem(key);
    expect(actualValue).to.eq(expectedValue);
  });
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add("checkLayout", (layout) => {
  const layoutMapping = {
    CompactLayout: {
      shouldExist: ["header"],
      shouldNotExist: [
        "dashboard-layout-header",
        "dashboard-layout-nav-horizontal",
        "nav-mini",
        "nav-horizontal",
        "nav-vertical",
      ],
    },
    FullScreenLayout: {
      shouldExist: ["nav-mini"],
      shouldNotExist: [
        "header",
        "dashboard-layout-header",
        "dashboard-layout-nav-horizontal",
        "nav-horizontal",
        "nav-vertical",
      ],
    },
    DashboardLayout: {
      shouldExist: ["dashboard-layout-header", "nav-vertical"],
      shouldNotExist: [
        "header",
        "dashboard-layout-nav-horizontal",
        "nav-mini",
        "nav-horizontal",
      ],
    },
  };

  const layoutChecks = layoutMapping[layout];

  if (layoutChecks) {
    layoutChecks.shouldExist.forEach((element) => {
      cy.getBySel(element).should("be.exist");
    });

    layoutChecks.shouldNotExist.forEach((element) => {
      cy.getBySel(element).should("not.exist");
    });
  }
});
