import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'bun')
);
export const selectMains = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'main')
);
export const selectSauces = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'sauce')
);

export const selectIngredientById = (id: string | undefined) =>
  createSelector(selectIngredients, (items) =>
    id ? items.find((item) => item._id === id) : undefined
  );
