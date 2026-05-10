/// <reference types="cypress" />

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианского магния';
const SAUCE_NAME = 'Соус Spicy-X';

const interceptCommonRoutes = () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
};

describe('Stellar Burgers — конструктор', () => {
  beforeEach(() => {
    interceptCommonRoutes();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавляет булку в конструктор по клику на кнопку «Добавить»', () => {
      cy.contains('li', BUN_NAME)
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains(`${BUN_NAME} (верх)`).should('exist');
      cy.contains(`${BUN_NAME} (низ)`).should('exist');
    });

    it('добавляет начинку (main) в конструктор по клику на «Добавить»', () => {
      cy.contains('li', MAIN_NAME)
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Выберите начинку').should('not.exist');
      cy.contains(MAIN_NAME).should('exist');
    });

    it('добавляет соус в конструктор', () => {
      cy.contains('li', SAUCE_NAME)
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains(SAUCE_NAME).should('exist');
    });
  });

  describe('Модальное окно с описанием ингредиента', () => {
    it('открывается по клику на карточку и показывает данные именно этого ингредиента', () => {
      cy.contains('a', MAIN_NAME).click();

      cy.get('#modals').children().should('have.length.at.least', 1);
      cy.get('#modals').contains('Детали ингредиента').should('exist');
      cy.get('#modals').contains(MAIN_NAME).should('exist');
      cy.get('#modals').contains('420').should('exist'); // proteins
      cy.get('#modals').contains('4242').should('exist'); // calories
      cy.url().should('include', '/ingredients/');
    });

    it('закрывается по клику на крестик', () => {
      cy.contains('a', MAIN_NAME).click();
      cy.get('#modals').contains(MAIN_NAME).should('exist');

      cy.get('#modals').find('button').first().click();

      cy.get('#modals').children().should('have.length', 0);
      cy.url().should('not.include', '/ingredients/');
    });

    it('закрывается по клику на оверлей', () => {
      cy.contains('a', MAIN_NAME).click();
      cy.get('#modals').contains(MAIN_NAME).should('exist');

      // Внутри #modals: первый div — само окно модалки, второй (последний) — оверлей.
      cy.get('#modals > div').last().click({ force: true });

      cy.get('#modals').children().should('have.length', 0);
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'postOrder'
      );

      cy.setCookie('accessToken', 'test-access-token');

      // переинициализируем страницу, чтобы checkUserAuth подхватил cookie и подгрузил пользователя
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });
      cy.wait(['@getIngredients', '@getUser']);
    });

    afterEach(() => {
      cy.clearCookies();
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('собирает бургер, оформляет заказ и очищает конструктор', () => {
      // 1. Собираем бургер
      cy.contains('li', BUN_NAME)
        .find('button')
        .contains('Добавить')
        .click();
      cy.contains('li', MAIN_NAME)
        .find('button')
        .contains('Добавить')
        .click();
      cy.contains('li', SAUCE_NAME)
        .find('button')
        .contains('Добавить')
        .click();

      // 2. Кликаем «Оформить заказ»
      cy.contains('button', 'Оформить заказ').click();

      // 3. Проверяем, что запрос ушёл и модалка показала номер заказа
      cy.wait('@postOrder');
      cy.get('#modals').contains('12345').should('exist');

      // 4. Закрываем модалку и проверяем её закрытие
      cy.get('#modals').find('button').first().click();
      cy.get('#modals').children().should('have.length', 0);

      // 5. Проверяем, что конструктор пуст
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
      cy.contains(`${BUN_NAME} (верх)`).should('not.exist');
      cy.contains(`${BUN_NAME} (низ)`).should('not.exist');

      // Название ингредиента может оставаться в списке слева,
      // поэтому проверяем отсутствие именно в зоне конструктора.
      cy.contains('button', 'Оформить заказ')
        .closest('section')
        .as('constructor');

      cy.get('@constructor').contains(MAIN_NAME).should('not.exist');
      cy.get('@constructor').contains(SAUCE_NAME).should('not.exist');
    });
  });
});
