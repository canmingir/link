describe("SelectBar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should list emperors", () => {
    cy.getBySel("open-select-bar-button").click();
    cy.getBySel("select-bar-dialog").should("be.visible");
    cy.getBySel("item-list");
    cy.getBySel("item-button").should("have.length", 3);
  });
  it("should select an emperor", () => {
    cy.getBySel("open-select-bar-button").click();
    cy.getBySel("item-button").first().click();
    cy.checkStorage("itemId", "1");
    cy.contains("Marcus Aurelius");
  });
  it("should search for an emperor", () => {
    cy.getBySel("open-select-bar-button").click();
    cy.getBySel("item-input").type("marcus");
    cy.getBySel("item-button").should("have.length", 1);
    cy.getBySel("item-button").contains("Marcus Aurelius");
  });
  it.only("should add a new emperor", () => {
    cy.getBySel("open-select-bar-button").click();
    cy.getBySel("add-new-item-button").click();

    cy.get('input[name="name"]').type("Emperor Name");
    cy.get('input[name="born"]').type("Born Date");
    cy.get('input[name="icon"]').type("Icon URL");
    cy.get('input[name="reign"]').type("Reign Period");
    cy.get('input[name="portrait"]').type("Portrait URL");
    cy.get('input[name="description"]').type("Description");

    cy.get('button[type="submit"]').click();
  });
});
