import { rootReducer } from './store';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      newOrder: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        currentOrder: null,
        isLoading: false,
        error: null
      },
      userOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        loginError: null,
        registerError: null,
        updateError: null
      }
    });
  });

  it('содержит все ожидаемые ключи слайсов', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(Object.keys(state).sort()).toEqual(
      [
        'ingredients',
        'burgerConstructor',
        'newOrder',
        'feed',
        'userOrders',
        'user'
      ].sort()
    );
  });
});
