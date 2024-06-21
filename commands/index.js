import user from "./user.json";
Cypress.Commands.add("checkStorage", (key, expectedValue) => {
  cy.window().should((win) => {
    const actualValue = win.localStorage.getItem(key);
    expect(actualValue).to.eq(expectedValue);
  });
});

Cypress.Commands.add("storageSet", (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, JSON.stringify(value));
  });
});

Cypress.Commands.add("storageGet", (key) => {
  cy.window().then((win) => {
    return JSON.parse(win.localStorage.getItem(key));
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

Cypress.Commands.add("waitEvent", (eventName) => {
  cy.window().then((window) => {
    const { Event } = window["@nucleoidai"];

    return new Cypress.Promise((resolve) => {
      Event.subscribe(eventName, (payload) => {
        cy.log("react-event", eventName, payload);
        resolve();
      });
    });
  });
});

Cypress.Commands.add("checkRoute", (route) => {
  cy.url().should("include", route);
});

Cypress.Commands.add(
  "platformSetup",
  (itemId, itemFixturePath, config, templateConfig) => {
    cy.storageSet("itemId", itemId);

    cy.storageSet(`${config.name}.refreshToken`, "TEST_REFRESH_TOKEN");
    cy.storageSet(`${config.name}.accessToken`, "TEST_ACCESS_TOKEN");

    cy.intercept("GET", `https://api.github.com/user`, user).as("getUser");

    cy.intercept("GET", templateConfig.itemsPath, {
      fixture: itemFixturePath,
    }).as("getTeams");
  }
);

Cypress.Commands.add("selectIconFromPicker", (altText) => {
  cy.get("em-emoji-picker")
    .shadow()
    .within(() => {
      cy.get("[class='category']")
        .find("span")
        .find("img")
        .filter(`[alt="${altText}"]`)
        .click();
    });
});
