/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Кликает по кнопке «Добавить» внутри карточки ингредиента
       * с указанным названием.
       */
      addIngredient(name: string): Chainable<void>;
      /**
       * Возвращает <section> конструктора бургера —
       * используется для скоупа проверок «ингредиент в бургере».
       */
      getConstructor(): Chainable<JQuery<HTMLElement>>;
      /**
       * Возвращает корневой элемент портала модальных окон (#modals).
       */
      getModal(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('addIngredient', (name: string) => {
  cy.contains('li', name).find('button').contains('Добавить').click();
});

Cypress.Commands.add('getConstructor', () =>
  cy.contains('button', 'Оформить заказ').closest('section')
);

Cypress.Commands.add('getModal', () => cy.get('#modals'));

export {};
