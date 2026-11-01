import type { Component } from "vue";
import { mount, type VueWrapper, type MountingOptions } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";

export interface MountWithPluginsOptions extends MountingOptions<any, any> {
  initialState?: Record<string, any>;
}

export function mountWithPlugins(
  component: Component,
  options?: MountWithPluginsOptions,
): VueWrapper {
  const { initialState, ...mountOptions } = options ?? {};

  const pinia = createPinia();
  if (initialState) {
    Object.keys(initialState).forEach((storeName) => {
      pinia.state.value[storeName] = {
        ...(pinia.state.value[storeName] ?? {}),
        ...initialState[storeName],
      };
    });
  }

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  return mount(component, {
    ...mountOptions,
    global: {
      plugins: [pinia, router],
      ...(mountOptions.global ?? {}),
    },
  });
}
