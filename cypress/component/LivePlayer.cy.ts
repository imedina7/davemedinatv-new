import LivePlayer from "@/components/LivePlayer.vue";

describe("LivePlayer", () => {
  it("renders iframe with correct src", () => {
    cy.mount(LivePlayer);
    cy.get("iframe")
      .should(
        "have.attr",
        "src",
        "https://player.twitch.tv/?channel=davemedinatv&parent=localhost",
      )
      .and("have.attr", "title", "Twitch Player");
  });

  it("iframe has allowfullscreen", () => {
    cy.mount(LivePlayer);
    cy.get("iframe").should("have.attr", "allowfullscreen");
  });
});
