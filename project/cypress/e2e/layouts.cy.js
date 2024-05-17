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

describe("DashboardLayout", () => {
  beforeEach(() => {
    cy.fixture("CONFIG/MENU_CONFIG.js").as("config");
    cy.viewport(1280, 720);
  });

  it("should contain header and vertical nav", () => {
    cy.visit("http://localhost:5173/emperor");
    cy.getBySel("header").should("not.exist");
    cy.getBySel("dashboard-layout-header").should("be.exist");
    cy.getBySel("dashboard-layout-nav-horizontal").should("not.exist");
    cy.getBySel("nav-mini").should("not.exist");
    cy.getBySel("nav-horizontal").should("not.exist");
    cy.getBySel("nav-vertical").should("be.exist");
  });

  it("should include paths from config.menu in navigation", () => {
    cy.visit("http://localhost:5173/emperor");

    cy.get("@config").then((config) => {
      config.sideMenu[0].items.map((item) =>
        cy.getBySel("nav-vertical").contains(item.title)
      );
    });
  });

  it("should redirect to the correct path", () => {
    cy.visit("http://localhost:5173/emperor");

    cy.get("@config").then((config) => {
      cy.getBySel("nav-vertical")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.url().should("include", config.sideMenu[0].items[0].path);
    });
  });

  it("when click action button open snackbar", () => {
    cy.visit("http://localhost:5173/emperor");

    cy.get("@config").then((config) => {
      cy.getBySel("nav-vertical")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.contains("Talk to Emperor").click();
      cy.contains("Emperor is busy right now").should("be.visible");
    });
  });

  it("when click end item navigate to the correct path", () => {
    cy.visit("http://localhost:5173/emperor");

    cy.get("@config").then((config) => {
      cy.getBySel("nav-vertical")
        .contains(config.sideMenu[0].items[0].title)
        .click();

      cy.getBySel("end-item").click();

      cy.get("@config").then((config) => {
        cy.url().should("include", config.endItem.path);
      });
    });
  });
});
