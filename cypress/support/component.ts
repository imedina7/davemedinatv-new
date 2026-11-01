import { mount } from "cypress/vue";
import { createPinia } from "pinia";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", (component, options: any = {}) => {
  const pinia = createPinia();

  options.global = options.global || {};
  options.global.plugins = [pinia, ...(options.global.plugins || [])];

  return mount(component, options);
});
