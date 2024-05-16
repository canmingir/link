describe("SelectBar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");

    cy.fixture("EMPEROR/EMPERORS_GET.json").then((emperors) => {
      cy.intercept("GET", "http://localhost:3000/emperors", {
        statusCode: 200,
        body: emperors.twoEmperors,
      });
    });

    cy.fixture("EMPEROR/EMPERORS_POST.json").then((emperor) => {
      cy.intercept("POST", "http://localhost:3000/emperors", {
        statusCode: 200,
        body: emperor,
      });
    });

    cy.fixture("EMPEROR/EMPERORS_GET.json").then((emperors) => {
      cy.intercept("GET", "http://localhost:3000/emperors", {
        statusCode: 200,
        body: emperors.threeEmperors,
      });
    });
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

    cy.fixture("EMPEROR/EMPERORS_POST.json").then((emperor) => {
      cy.get('input[name="name"]').type(emperor.name);
      cy.get('input[name="born"]').type(emperor.born);
      cy.get('input[name="icon"]').type(emperor.icon);
      cy.get('input[name="reign"]').type(emperor.reign);
      cy.get('input[name="portrait"]').type(emperor.portrait);
      cy.get('input[name="description"]').type(emperor.description);
    });

    cy.get('button[type="submit"]').click();
  });
});
