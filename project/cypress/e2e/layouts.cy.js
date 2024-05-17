describe("CompactLayout", () => {
  it("should contain only header", () => {
    cy.visit("http://localhost:5173");
    cy.getBySel("header").should("be.exist");
    cy.getBySel("dashboard-layout-header").should("not.exist");
    cy.getBySel("dashboard-layout-nav-horizontal").should("not.exist");
    cy.getBySel("nav-mini").should("not.exist");
    cy.getBySel("nav-horizontal").should("not.exist");
    cy.getBySel("nav-vertical").should("not.exist");
  });
});

describe("FullScreenLayout", () => {
  beforeEach(() => {
    cy.fixture("CONFIG/MENU_CONFIG.js").as("config");
  });

  it("should contain only mini nav ", () => {
    cy.visit("http://localhost:5173/emperor/battle");
    cy.getBySel("header").should("not.exist");
    cy.getBySel("dashboard-layout-header").should("not.exist");
    cy.getBySel("dashboard-layout-nav-horizontal").should("not.exist");
    cy.getBySel("nav-mini").should("be.exist");
    cy.getBySel("nav-horizontal").should("not.exist");
    cy.getBySel("nav-vertical").should("not.exist");
  });

  it("should include paths from config.menu in navigation", () => {
    cy.visit("http://localhost:5173/emperor/battle");

    cy.get("@config").then((config) => {
      config.sideMenu[0].items.map((item) =>
        cy.getBySel("nav-mini").contains(item.title)
      );
    });
  });

  it("should redirect to the correct path", () => {
    cy.visit("http://localhost:5173/emperor/battle");

    cy.get("@config").then((config) => {
      cy.getBySel("nav-mini")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.url().should("include", config.sideMenu[0].items[0].path);
    });
  });
});
});
