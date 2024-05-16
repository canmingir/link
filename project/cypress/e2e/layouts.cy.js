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

