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
    return JSON.parse(win.localStorage.getItem(key) ?? "null");
  });
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(
    `[data-cy=${selector}]`,
    ...(args as [Partial<Cypress.Timeoutable & Cypress.Loggable> | undefined])
  );
});

Cypress.Commands.add("checkLayout", (layout: string) => {
  const layoutMapping: Record<
    string,
    { shouldExist: string[]; shouldNotExist: string[] }
  > = {
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
    layoutChecks.shouldExist.forEach((element: string) => {
      cy.getBySel(element).should("be.exist");
    });

    layoutChecks.shouldNotExist.forEach((element: string) => {
      cy.getBySel(element).should("not.exist");
    });
  }
});

Cypress.Commands.add("waitEvent", (eventName: string) => {
  cy.window().then((window) => {
    const { Event } = (window as unknown as Record<string, unknown>)[
      "@nucleoidai"
    ] as {
      Event: { subscribe: (n: string, cb: (p: unknown) => void) => void };
    };

    return new Cypress.Promise((resolve) => {
      Event.subscribe(eventName, (payload: unknown) => {
        cy.log("react-event", eventName, payload);
        resolve();
      });
    });
  });
});

Cypress.Commands.add("checkRoute", (route: string) => {
  cy.url().should("include", route);
});

Cypress.Commands.add(
  "platformSetup",
  (itemId, itemFixturePath, config: { name: string }) => {
    cy.storageSet("link.projectid", itemId);

    cy.storageSet(`${config.name}.refreshtoken`, "TEST_REFRESH_TOKEN");
    cy.storageSet(`${config.name}.accesstoken`, "TEST_ACCESS_TOKEN");

    cy.intercept("GET", `https://api.github.com/user`, user).as("getUser");

    cy.intercept("GET", "/projects", {
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
