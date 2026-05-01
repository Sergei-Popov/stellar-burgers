import { RootState } from '../store';

export const selectOrderRequest = (state: RootState) =>
  state.newOrder.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.newOrder.orderModalData;
export const selectNewOrderError = (state: RootState) => state.newOrder.error;
