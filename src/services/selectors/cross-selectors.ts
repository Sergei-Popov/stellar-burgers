import { createSelector } from '@reduxjs/toolkit';
import { selectFeedCurrentOrder, selectFeedOrders } from './feed-selectors';
import { selectUserOrders } from './user-orders-selectors';

export const selectOrderByNumber = (number: number) =>
  createSelector(
    selectFeedOrders,
    selectUserOrders,
    selectFeedCurrentOrder,
    (feedOrders, userOrders, currentOrder) =>
      feedOrders.find((o) => o.number === number) ||
      userOrders.find((o) => o.number === number) ||
      (currentOrder && currentOrder.number === number ? currentOrder : null)
  );
