/// <reference types="cypress" />

describe("Navigation", () => {
  it("loads the home page successfully", () => {
    cy.visit("/");
    cy.url().should("include", "/");
    cy.get("body").should("be.visible");
  });

  it("navigates to /videos and back", () => {
    cy.visit("/");
    cy.visit("/videos");
    cy.url().should("include", "/videos");

    cy.go("back");
    cy.url().should("not.include", "/videos");
  });

  it("shows the NavBar on both routes", () => {
    cy.visit("/");
    cy.get("nav").should("be.visible");

    cy.visit("/videos");
    cy.get("nav").should("be.visible");
  });
});
