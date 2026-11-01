import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";
import NavBar from "@/components/NavBar.vue";
import { useRootStore, useUiStore } from "@/store";

library.add(icons);

describe("NavBar", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("renders nav links", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const router = createRouter({ history: createWebHistory(), routes });
    cy.mount(NavBar, {
      global: {
        plugins: [pinia, router],
        components: { FontAwesomeIcon },
      },
    });
    cy.contains("videos").should("exist");
  });

  it('shows "en vivo" button when stream is live', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const rootStore = useRootStore();
    rootStore.stream.isLive = true;
    const router = createRouter({ history: createWebHistory(), routes });
    cy.mount(NavBar, {
      global: {
        plugins: [pinia, router],
        components: { FontAwesomeIcon },
      },
    });
    cy.get('[aria-label="Watch live stream"]').should("exist");
  });

  it("hides button when stream is offline", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const rootStore = useRootStore();
    rootStore.stream.isLive = false;
    const router = createRouter({ history: createWebHistory(), routes });
    cy.mount(NavBar, {
      global: {
        plugins: [pinia, router],
        components: { FontAwesomeIcon },
      },
    });
    cy.get('[aria-label="Watch live stream"]').should("not.exist");
  });

  it("button click calls openLiveModal", () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const rootStore = useRootStore();
    rootStore.stream.isLive = true;
    const uiStore = useUiStore();
    const openSpy = cy.spy(uiStore, "openLiveModal");
    const router = createRouter({ history: createWebHistory(), routes });
    cy.mount(NavBar, {
      global: {
        plugins: [pinia, router],
        components: { FontAwesomeIcon },
      },
    });
    cy.get('[aria-label="Watch live stream"]').click();
    cy.then(() => {
      expect(openSpy).to.have.been.called;
    });
  });
});
