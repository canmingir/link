describe("CompactLayout", () => {
  it("should contain only header", () => {
    cy.visit("/");
    cy.checkLayout("CompactLayout");
  });
});

describe("FullScreenLayout", () => {
  beforeEach(() => {
    cy.fixture("CONFIG/MENU_CONFIG.js").as("config");
  });

  it("should contain only mini nav ", () => {
    cy.visit("/emperor/battle");
    cy.checkLayout("FullScreenLayout");
  });

  it("should include paths from config.menu in navigation", () => {
    cy.visit("/emperor/battle");

    cy.get("@config").then((config) => {
      config.sideMenu[0].items.map((item) =>
        cy.getBySel("nav-mini").contains(item.title)
      );
    });
  });

  it("should redirect to the correct path", () => {
    cy.visit("/emperor/battle");

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
    cy.visit("/emperor");
    cy.checkLayout("DashboardLayout");
  });

  it("should include paths from config.menu in navigation", () => {
    cy.visit("/emperor");

    cy.get("@config").then((config) => {
      config.sideMenu[0].items.map((item) =>
        cy.getBySel("nav-vertical").contains(item.title)
      );
    });
  });

  it("should redirect to the correct path", () => {
    cy.visit("/emperor");

    cy.get("@config").then((config) => {
      cy.getBySel("nav-vertical")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.url().should("include", config.sideMenu[0].items[0].path);
    });
  });

  it("when click action button open snackbar", () => {
    cy.visit("/emperor");

    cy.get("@config").then((config) => {
      cy.getBySel("nav-vertical")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.contains("Talk to Emperor").click();
      cy.contains("Emperor is busy right now").should("be.visible");
    });
  });

  it("when click end item navigate to the correct path", () => {
    cy.visit("/emperor");

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

describe("CompactLayout (mobile)", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
  });

  it("should contain only header", () => {
    cy.visit("/");
    cy.checkLayout("CompactLayout");
  });
});

describe("FullScreenLayout (mobile)", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
  });

  it("should contain only mini nav ", () => {
    cy.visit("/emperor/battle");
    cy.checkLayout("FullScreenLayout");
  });
});

describe("DashboardLayout (mobile)", () => {
  beforeEach(() => {
    cy.viewport(375, 667);
    cy.fixture("CONFIG/MENU_CONFIG.js").as("config");
  });
  it("should contain header and vertical nav", () => {
    cy.visit("/emperor");
    cy.checkLayout("DashboardLayout");
  });
  it("should include paths from config.menu in navigation", () => {
    cy.visit("/emperor");

    cy.getBySel("open-nav-button").click();

    cy.get("@config").then((config) => {
      config.sideMenu[0].items.map((item) =>
        cy.get(".simplebar-content").contains(item.title)
      );
    });
  });

  it("should redirect to the correct path", () => {
    cy.visit("/emperor");

    cy.getBySel("open-nav-button").click();

    cy.get("@config").then((config) => {
      cy.get(".simplebar-content")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.url().should("include", config.sideMenu[0].items[0].path);
    });
  });

  it("when click action button open snackbar", () => {
    cy.visit("/emperor");

    cy.getBySel("open-nav-button").click();

    cy.get("@config").then((config) => {
      cy.get(".simplebar-content")
        .contains(config.sideMenu[0].items[0].title)
        .click();
      cy.contains("Talk to Emperor").click();
      cy.contains("Emperor is busy right now").should("be.visible");
    });
  });
});
