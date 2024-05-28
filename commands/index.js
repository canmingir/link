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

Cypress.Commands.add("waitEvent", (eventName) => {
  return cy.wrap(
    new Promise((resolve) => {
      cy.window().then((window) => {
        const { Event } = window["@nucleoidai"];

        Event.subscribe(eventName, (payload, registry) => {
          cy.log("react-event", eventName, payload);
          // TODO Research why registry is undefined
          // registry.unsubscribe();

          resolve();
        });
      });
    })
  );
});
