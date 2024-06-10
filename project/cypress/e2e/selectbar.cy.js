describe("SelectBar", () => {
  beforeEach(() => {
    cy.fixture("EMPEROR/EMPERORS_POST.json").as("newEmperor");
    cy.fixture("EMPEROR/EMPERORS_GET.json").as("emperors");

    cy.get("@emperors").then((emperors) => {
      cy.intercept("GET", "http://localhost:3000/emperors", {
        statusCode: 200,
        body: emperors.twoEmperors,
      });
    });

    cy.get("@newEmperor").then((emperor) => {
      cy.intercept("POST", "http://localhost:3000/emperors", {
        statusCode: 200,
        body: emperor,
      });
    });

    cy.visit("/");
  });

  it("should list emperors", () => {
    cy.getBySel("open-select-bar-button").click();
    cy.getBySel("select-bar-dialog").should("be.visible");

    cy.getBySel("item-list");

    cy.get("@emperors").then((emperors) => {
      cy.getBySel("item-button").should(
        "have.length",
        emperors.twoEmperors.length
      );
      cy.getBySel("item-button").contains(emperors.twoEmperors[0].name);
      cy.getBySel("item-button").contains(emperors.twoEmperors[1].name);
    });
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

  it("should add a new emperor", () => {
    cy.get("@emperors").then((emperors) => {
      cy.intercept("GET", "http://localhost:3000/emperors", {
        statusCode: 200,
        body: emperors.threeEmperors,
      });
    });

    cy.getBySel("open-select-bar-button").click();
    cy.getBySel("add-new-item-button").click();

    cy.get("@newEmperor").then((emperor) => {
      cy.get('input[name="name"]').type(emperor.name);
      cy.get('input[name="born"]').type(emperor.born);
      cy.get('input[name="icon"]').type(emperor.icon);
      cy.get('input[name="reign"]').type(emperor.reign);
      cy.get('input[name="portrait"]').type(emperor.portrait);
      cy.get('input[name="description"]').type(emperor.description);
    });

    cy.get('button[type="submit"]').click();
    cy.getBySel("item-button").should("have.length", 3);

    cy.get("@newEmperor").then((emperor) => {
      cy.getBySel("item-button").contains(emperor.name);
    });
  });
});
