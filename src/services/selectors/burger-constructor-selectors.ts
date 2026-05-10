import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectConstructorItems = createSelector(
  selectConstructorBun,
  selectConstructorIngredients,
  (bun, ingredients) => ({ bun, ingredients })
);

export const selectConstructorPrice = createSelector(
  selectConstructorBun,
  selectConstructorIngredients,
  (bun, ingredients) =>
    (bun ? bun.price * 2 : 0) +
    ingredients.reduce((sum, item) => sum + item.price, 0)
);

export const selectIngredientsCounters = createSelector(
  selectConstructorBun,
  selectConstructorIngredients,
  (bun, ingredients) => {
    const counters: Record<string, number> = {};
    ingredients.forEach((item) => {
      counters[item._id] = (counters[item._id] || 0) + 1;
    });
    if (bun) {
      counters[bun._id] = 2;
    }
    return counters;
  }
);
