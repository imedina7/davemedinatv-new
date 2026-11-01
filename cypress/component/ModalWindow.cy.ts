import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import ModalWindow from "@/components/ModalWindow.vue";

library.add(icons);

const focusDirective = { mounted: (el: any) => el.focus() };

describe("ModalWindow", () => {
  it("renders slot content", () => {
    cy.mount(ModalWindow, {
      slots: { default: "<div class='slot-content'>hello</div>" },
      global: {
        directives: { focus: focusDirective },
        components: { FontAwesomeIcon },
      },
    });
    cy.contains("hello").should("exist");
  });

  it("closes on backdrop click", () => {
    cy.mount(ModalWindow, {
      slots: { default: "<div class='inner-content'>content</div>" },
      global: {
        directives: { focus: focusDirective },
        components: { FontAwesomeIcon },
      },
    }).then(({ wrapper }) => {
      cy.wrap(wrapper).as("modalWrapper");
    });

    // click the backdrop (root element)
    cy.get(".fixed").first().click("topLeft");

    cy.get("@modalWrapper").then((wrapper: any) => {
      expect(wrapper.emitted("close")).to.not.be.undefined;
    });
  });

  it("closes on Escape key", () => {
    cy.mount(ModalWindow, {
      slots: { default: "<div>content</div>" },
      global: {
        directives: { focus: focusDirective },
        components: { FontAwesomeIcon },
      },
    }).then(({ wrapper }) => {
      cy.wrap(wrapper).as("modalWrapper");
    });

    cy.get(".fixed").first().trigger("keydown", { code: "Escape" });

    cy.get("@modalWrapper").then((wrapper: any) => {
      expect(wrapper.emitted("close")).to.not.be.undefined;
    });
  });

  it("does not close when inner content clicked", () => {
    cy.mount(ModalWindow, {
      slots: { default: "<div class='inner-content'>content</div>" },
      global: {
        directives: { focus: focusDirective },
        components: { FontAwesomeIcon },
      },
    }).then(({ wrapper }) => {
      cy.wrap(wrapper).as("modalWrapper");
    });

    cy.get(".inner-content").click({ force: true });

    cy.get("@modalWrapper").then((wrapper: any) => {
      // emitted close should be falsy or not called
      const emitted = wrapper.emitted("close");
      expect(emitted == null || emitted.length === 0).to.be.true;
    });
  });
});
