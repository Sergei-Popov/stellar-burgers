import { TOrder } from '@utils-types';
import {
  closeOrderModal,
  newOrderReducer,
  placeOrder,
  TNewOrderState
} from './new-order-slice';

const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

const mockOrder: TOrder = {
  _id: 'order-id-1',
  status: 'done',
  name: 'Краторный био-марсианский бургер',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

describe('newOrderReducer', () => {
  it('возвращает корректное начальное состояние', () => {
    expect(newOrderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('placeOrder', () => {
    it('при pending включает orderRequest и сбрасывает error', () => {
      const stateWithError: TNewOrderState = {
        ...initialState,
        error: 'Прошлая ошибка'
      };
      const state = newOrderReducer(stateWithError, {
        type: placeOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при fulfilled записывает данные заказа и выключает orderRequest', () => {
      const requestingState: TNewOrderState = {
        ...initialState,
        orderRequest: true
      };
      const state = newOrderReducer(requestingState, {
        type: placeOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('при rejected записывает текст ошибки и выключает orderRequest', () => {
      const requestingState: TNewOrderState = {
        ...initialState,
        orderRequest: true
      };
      const errorMessage = 'Server error';
      const state = newOrderReducer(requestingState, {
        type: placeOrder.rejected.type,
        error: { message: errorMessage }
      });
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('closeOrderModal', () => {
    it('очищает данные модального окна и ошибку', () => {
      const stateWithModal: TNewOrderState = {
        orderRequest: false,
        orderModalData: mockOrder,
        error: 'some error'
      };
      const state = newOrderReducer(stateWithModal, closeOrderModal());
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
