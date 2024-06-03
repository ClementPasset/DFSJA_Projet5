/// <reference types="Cypress" />
describe("Admin End-To-End Tests Suite", () => {

  beforeEach(() => {
    cy.intercept("POST", "/api/auth/login", {
      body: {
        id: 1,
        username: "userName",
        firstName: "firstName",
        lastName: "lastName",
        admin: true
      },
    });

    cy.intercept("GET", "api/session", [
      {
        id: 1,
        name: "Session 1",
        description: "Description 1",
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Session 2",
        description: "Description 2",
        date: new Date(),
        teacher_id: 2,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Session 3",
        description: "Description 3",
        date: new Date(),
        teacher_id: 2,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    cy.intercept("POST", "api/session", {});

    cy.intercept("GET", "/api/user/1", {
      id: 1,
      email: "email",
      lastName: "Prénom",
      firstName: "Nom",
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    cy.intercept("GET", "/api/teacher", [
      {
        id: "1",
        lastName: "Jean",
        firstName: "DUPONT",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        lastName: "John",
        firstName: "DOE",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  });

  it("Log in", () => {
    cy.visit("/login");

    cy.get("input[formControlName=email]").type("yoga@studio.com");
    cy.get("input[formControlName=password]").type(`${"test!1234"}`);

    cy.get("button").contains("Submit").click();

    cy.url().should("contain", "/sessions");
  });

  it("Goes in the Account section to see 'You are admin' message", () => {
    cy.contains("Account").click();

    cy.get("p").contains("admin").should("have.text", "You are admin");
  });

  it("goes back to sessions' list", () => {
    cy.get("mat-card-title button mat-icon").click();
    cy.url().should("contain", "/sessions");
  });

  it("creates a new session", () => {
    cy.contains("Create").click();

    cy.get("button[type='submit']").should("be.disabled");

    cy.get("input[formControlName='name']").type("Le nom de la nouvelle session");
    cy.get("input[formControlName='date']").type((new Date()).toLocaleDateString().replace(/(\d{2})\/(\d{2})\/(\d{4})/g, "$3-$2-$1"));
    cy.get("mat-select[formControlName='teacher_id']").click().get("mat-option").contains("DOE").click();
    cy.get("textarea[formControlName='description']").type("Voilà la description pour la nouvelle sessions de yoga qu'on est en train de créer...");

    cy.get("button[type='submit']").should("not.be.disabled");

    cy.get("button[type='submit']").click();

    cy.get("simple-snack-bar").should("contain.text", "Session created");

    cy.url().should("contain", "/sessions");
  })
});