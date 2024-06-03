/// <reference types="Cypress" />
describe("Non-Admin End-To-End Tests Suite", () => {
    let callCounter = 0;
  
    beforeEach(() => {
  
      cy.intercept("POST", "/api/auth/login", {
        body: {
          id: 1,
          username: "userName",
          firstName: "firstName",
          lastName: "lastName",
          admin: false
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
        admin: false,
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
  
      cy.intercept("GET", "/api/teacher/*", {
        id: "1",
        lastName: "Jean",
        firstName: "DUPONT",
        createdAt: new Date(),
        updatedAt: new Date()
      })
  
      cy.intercept("GET", "/api/session/*", req => {
        callCounter++;
        console.log("callCounter: " + callCounter);
        let response = {
          id: 1,
          name: "Session 1",
          description: "Description 1",
          date: new Date(),
          teacher_id: 1,
          users: callCounter === 2 ? [1] : [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
  
        req.reply(response);
      });
  
      cy.intercept("POST", "/api/session/*/participate/*", {})
      cy.intercept("DELETE", "/api/session/*/participate/*", {})
    });
  
    it("Register a new user", () => {
      cy.visit("/register");
  
    })
  
    it("Log in", () => {
      cy.visit("/login");
  
      cy.get("input[formControlName=email]").type("yoga@studio.com");
      cy.get("input[formControlName=password]").type(`${"test!1234"}`);
  
      cy.get("button").contains("Submit").click();
  
      cy.url().should("contain", "/sessions");
    });
  
    it("Goes in the Account section to see the delete button", () => {
      cy.contains("Account").click();
  
      cy.get("button.mat-warn").should("exist");
    });
  
    it("goes back to sessions' list", () => {
      cy.get("mat-card-title button mat-icon").click();
      cy.url().should("contain", "/sessions");
    });
  
    it("should open the details of a session", () => {
      cy.get("button span.ml1").first().click();
  
      cy.url().should("contain", "sessions/detail");
    });
  
    it("should participate to a session", () => {
      cy.get("button").contains("Participate").click();
      cy.get("button").contains("Do not participate").should("exist");
    });
  
    it("should unParticipate to a session", () => {
      cy.get("button").contains("Do not participate").click();
      cy.get("button").contains("Participate").should("exist");
    });
  
    it("goes back to sessions' list", () => {
      cy.get("button.mat-button-base").first().click();
      cy.url().should("contain", "/sessions");
    });
  
    it("should lot out", () => {
      cy.contains("Logout").click();
      cy.contains("Login").should("exist");
      cy.contains("Register").should("exist");
    });
  })