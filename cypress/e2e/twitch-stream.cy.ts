/// <reference types="cypress" />

describe("Twitch stream", () => {
  it("renders the video catalog on the home page when the stream is offline", () => {
    cy.intercept("GET", "/api/twitch/stream", {
      fixture: "stream-offline.json",
    }).as("streamOffline");

    cy.visit("/");
    cy.wait("@streamOffline");

    cy.contains("Ultimos videos").should("be.visible");
    cy.get('button[aria-label="Watch live stream"]').should("not.exist");
  });

  it("shows the En Vivo button when the stream is live", () => {
    cy.intercept("GET", "/api/twitch/stream", {
      fixture: "stream-live.json",
    }).as("streamLive");

    cy.visit("/");
    cy.wait("@streamLive");

    cy.get('button[aria-label="Watch live stream"]').should("be.visible");
    cy.contains(/en vivo/i).should("be.visible");
  });

  it("opens a modal with the Twitch player iframe when clicking En Vivo", () => {
    cy.intercept("GET", "/api/twitch/stream", {
      fixture: "stream-live.json",
    }).as("streamLive");

    cy.visit("/");
    cy.wait("@streamLive");

    cy.get('button[aria-label="Watch live stream"]').click();
    cy.get("iframe[title='Twitch Player']").should("be.visible");
  });

  it("closes the modal on backdrop click", () => {
    cy.intercept("GET", "/api/twitch/stream", {
      fixture: "stream-live.json",
    }).as("streamLive");

    cy.visit("/");
    cy.wait("@streamLive");

    cy.get('button[aria-label="Watch live stream"]').click();
    cy.get("iframe[title='Twitch Player']").should("be.visible");

    cy.get("div.fixed.inset-0").click(10, 10);
    cy.get("iframe[title='Twitch Player']").should("not.exist");
  });

  it("closes the modal on Escape key", () => {
    cy.intercept("GET", "/api/twitch/stream", {
      fixture: "stream-live.json",
    }).as("streamLive");

    cy.visit("/");
    cy.wait("@streamLive");

    cy.get('button[aria-label="Watch live stream"]').click();
    cy.get("iframe[title='Twitch Player']").should("be.visible");

    cy.get("div.fixed.inset-0").trigger("keydown", {
      key: "Escape",
      code: "Escape",
    });
    cy.get("iframe[title='Twitch Player']").should("not.exist");
  });

  it("shows the Stream ended notice when the stream goes offline during viewing", () => {
    let callCount = 0;
    cy.intercept("GET", "/api/twitch/stream", (req) => {
      callCount += 1;
      if (callCount === 1) {
        req.reply({ fixture: "stream-live.json" });
      } else {
        req.reply({ fixture: "stream-offline.json" });
      }
    }).as("streamState");

    cy.visit("/");
    cy.wait("@streamState");

    cy.get('button[aria-label="Watch live stream"]').click();
    cy.get("iframe[title='Twitch Player']").should("be.visible");

    // The store polls the stream state roughly every 60s.
    cy.wait(61000);
    cy.contains("Stream ended").should("be.visible");
  });
});
