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
      cy.addIngredient(BUN_NAME);

      cy.getConstructor().within(() => {
        cy.contains(`${BUN_NAME} (верх)`).should('exist');
        cy.contains(`${BUN_NAME} (низ)`).should('exist');
        cy.contains('Выберите булки').should('not.exist');
      });
    });

    it('добавляет начинку (main) в конструктор по клику на «Добавить»', () => {
      cy.addIngredient(MAIN_NAME);

      cy.getConstructor().within(() => {
        cy.contains('Выберите начинку').should('not.exist');
        cy.contains(MAIN_NAME).should('exist');
      });
    });

    it('добавляет соус в конструктор', () => {
      cy.addIngredient(SAUCE_NAME);

      cy.getConstructor().within(() => {
        cy.contains('Выберите начинку').should('not.exist');
        cy.contains(SAUCE_NAME).should('exist');
      });
    });
  });

  describe('Модальное окно с описанием ингредиента', () => {
    it('открывается по клику на карточку и показывает данные именно этого ингредиента', () => {
      cy.contains('a', MAIN_NAME).click();

      cy.getModal().as('modal');
      cy.get('@modal').children().should('have.length.at.least', 1);
      cy.get('@modal').contains('Детали ингредиента').should('exist');
      cy.get('@modal').contains(MAIN_NAME).should('exist');
      cy.get('@modal').contains('420').should('exist'); // proteins
      cy.get('@modal').contains('4242').should('exist'); // calories
      cy.url().should('include', '/ingredients/');
    });

    it('закрывается по клику на крестик', () => {
      cy.contains('a', MAIN_NAME).click();

      cy.getModal().as('modal');
      cy.get('@modal').contains(MAIN_NAME).should('exist');
      cy.get('@modal').find('button').first().click();

      cy.get('@modal').children().should('have.length', 0);
      cy.url().should('not.include', '/ingredients/');
    });

    it('закрывается по клику на оверлей', () => {
      cy.contains('a', MAIN_NAME).click();

      cy.getModal().as('modal');
      cy.get('@modal').contains(MAIN_NAME).should('exist');

      // Внутри #modals: первый div — само окно модалки, второй (последний) — оверлей.
      cy.get('@modal').children('div').last().click({ force: true });

      cy.get('@modal').children().should('have.length', 0);
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
      cy.addIngredient(BUN_NAME);
      cy.addIngredient(MAIN_NAME);
      cy.addIngredient(SAUCE_NAME);

      // 1a. Убеждаемся, что ингредиенты действительно попали в конструктор
      cy.getConstructor().within(() => {
        cy.contains(`${BUN_NAME} (верх)`).should('exist');
        cy.contains(MAIN_NAME).should('exist');
        cy.contains(SAUCE_NAME).should('exist');
      });

      // 2. Кликаем «Оформить заказ»
      cy.contains('button', 'Оформить заказ').click();

      // 3. Проверяем, что запрос ушёл и модалка показала номер заказа
      cy.wait('@postOrder');
      cy.getModal().as('modal');
      cy.get('@modal').contains('12345').should('exist');

      // 4. Закрываем модалку и проверяем её закрытие
      cy.get('@modal').find('button').first().click();
      cy.get('@modal').children().should('have.length', 0);

      // 5. Проверяем, что конструктор пуст
      cy.getConstructor().within(() => {
        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
        cy.contains(BUN_NAME).should('not.exist');
        cy.contains(MAIN_NAME).should('not.exist');
        cy.contains(SAUCE_NAME).should('not.exist');
      });
    });
  });
});
