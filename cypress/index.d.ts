import { mount } from "cypress/react";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      checkStorage(key: string, expectedValue: string): Chainable<void>;
      storageSet(key: string, value: unknown): Chainable<void>;
      storageGet(key: string): Chainable<unknown>;
      getBySel(
        selector: string,
        ...args: unknown[]
      ): Chainable<JQuery<HTMLElement>>;
      checkLayout(layout: string): Chainable<void>;
      waitEvent(eventName: string): Chainable<unknown>;
      checkRoute(route: string): Chainable<void>;
      platformSetup(
        itemId: string,
        itemFixturePath: string,
        config: { name: string }
      ): Chainable<void>;
      selectIconFromPicker(altText: string): Chainable<void>;
    }
  }
}

export {};
