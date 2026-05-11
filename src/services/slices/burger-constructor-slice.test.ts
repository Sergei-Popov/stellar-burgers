import { TIngredient } from '@utils-types';
import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  TBurgerConstructorState
} from './burger-constructor-slice';
import { placeOrder } from './new-order-slice';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockBun2: TIngredient = {
  ...mockBun,
  _id: 'bun-2',
  name: 'Флюоресцентная булка R2-D3',
  price: 988
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианского магния',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png'
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_mobile: 'sauce-mobile.png',
  image_large: 'sauce-large.png'
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructorReducer', () => {
  it('возвращает корректное начальное состояние', () => {
    expect(
      burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' })
    ).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('кладёт булку в state.bun, не добавляя её в массив ингредиентов', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      expect(state.bun).toMatchObject({ _id: 'bun-1', type: 'bun' });
      expect(state.bun?.id).toEqual(expect.any(String));
      expect(state.ingredients).toHaveLength(0);
    });

    it('добавляет начинку в массив ingredients и не трогает bun', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockMain)
      );
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        _id: 'main-1',
        type: 'main'
      });
      expect(state.ingredients[0].id).toEqual(expect.any(String));
    });

    it('генерирует уникальный id при повторном добавлении одного и того же ингредиента', () => {
      const afterFirst = burgerConstructorReducer(
        initialState,
        addIngredient(mockMain)
      );
      const afterSecond = burgerConstructorReducer(
        afterFirst,
        addIngredient(mockMain)
      );
      expect(afterSecond.ingredients).toHaveLength(2);
      expect(afterSecond.ingredients[0].id).not.toEqual(
        afterSecond.ingredients[1].id
      );
    });

    it('заменяет ранее установленную булку при добавлении новой', () => {
      const stateWithBun = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const stateWithSecondBun = burgerConstructorReducer(
        stateWithBun,
        addIngredient(mockBun2)
      );
      expect(stateWithSecondBun.bun?._id).toBe('bun-2');
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент по id', () => {
      const stateWithItems = burgerConstructorReducer(
        initialState,
        addIngredient(mockMain)
      );
      const targetId = stateWithItems.ingredients[0].id;
      const state = burgerConstructorReducer(
        stateWithItems,
        removeIngredient(targetId)
      );
      expect(state.ingredients).toHaveLength(0);
    });

    it('игнорирует удаление по несуществующему id', () => {
      const stateWithItems = burgerConstructorReducer(
        initialState,
        addIngredient(mockMain)
      );
      const state = burgerConstructorReducer(
        stateWithItems,
        removeIngredient('non-existent')
      );
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredientUp / moveIngredientDown', () => {
    const buildStateWithThreeIngredients = (): TBurgerConstructorState => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
      state = burgerConstructorReducer(state, addIngredient(mockBun));
      // bun не попадает в массив; добавим ещё одну начинку для третьего элемента
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      return state;
    };

    it('moveIngredientUp меняет элемент местами с предыдущим', () => {
      const before = buildStateWithThreeIngredients();
      const [first, second] = before.ingredients;
      const state = burgerConstructorReducer(before, moveIngredientUp(1));
      expect(state.ingredients[0].id).toBe(second.id);
      expect(state.ingredients[1].id).toBe(first.id);
    });

    it('moveIngredientUp с index=0 не меняет порядок', () => {
      const before = buildStateWithThreeIngredients();
      const state = burgerConstructorReducer(before, moveIngredientUp(0));
      expect(state.ingredients.map((i) => i.id)).toEqual(
        before.ingredients.map((i) => i.id)
      );
    });

    it('moveIngredientDown меняет элемент местами со следующим', () => {
      const before = buildStateWithThreeIngredients();
      const [first, second] = before.ingredients;
      const state = burgerConstructorReducer(before, moveIngredientDown(0));
      expect(state.ingredients[0].id).toBe(second.id);
      expect(state.ingredients[1].id).toBe(first.id);
    });

    it('moveIngredientDown на последнем индексе не меняет порядок', () => {
      const before = buildStateWithThreeIngredients();
      const lastIndex = before.ingredients.length - 1;
      const state = burgerConstructorReducer(
        before,
        moveIngredientDown(lastIndex)
      );
      expect(state.ingredients.map((i) => i.id)).toEqual(
        before.ingredients.map((i) => i.id)
      );
    });
  });

  describe('clearConstructor', () => {
    it('возвращает состояние к начальному', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });

  describe('placeOrder.fulfilled (extraReducer)', () => {
    it('очищает конструктор после успешного оформления заказа', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      const fulfilledAction = {
        type: placeOrder.fulfilled.type,
        payload: {}
      };
      state = burgerConstructorReducer(state, fulfilledAction);
      expect(state).toEqual(initialState);
    });
  });
});
