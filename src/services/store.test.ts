import { rootReducer } from './store';
import { burgerConstructorReducer } from './slices/burger-constructor-slice';
import { ingredientsReducer } from './slices/ingredients-slice';
import { newOrderReducer } from './slices/new-order-slice';
import { feedReducer } from './slices/feed-slice';
import { userOrdersReducer } from './slices/user-orders-slice';
import { userReducer } from './slices/user-slice';

describe('rootReducer', () => {
  it('инициализирует состояние через композицию редьюсеров слайсов', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: burgerConstructorReducer(undefined, initAction),
      newOrder: newOrderReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      userOrders: userOrdersReducer(undefined, initAction),
      user: userReducer(undefined, initAction)
    });
  });

  it('делегирует неизвестный экшен каждому слайсу без изменения состояния', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      burgerConstructor: burgerConstructorReducer(undefined, unknownAction),
      newOrder: newOrderReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      userOrders: userOrdersReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction)
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
