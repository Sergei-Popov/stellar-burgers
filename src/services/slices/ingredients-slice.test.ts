import { TIngredient } from '@utils-types';
import {
  fetchIngredients,
  ingredientsReducer,
  TIngredientsState
} from './ingredients-slice';

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: 'ing-1',
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
  },
  {
    _id: 'ing-2',
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
  }
];

describe('ingredientsReducer', () => {
  it('возвращает корректное начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients', () => {
    it('при pending включает isLoading и сбрасывает error', () => {
      const stateWithError: TIngredientsState = {
        ...initialState,
        error: 'Прошлая ошибка'
      };
      const state = ingredientsReducer(stateWithError, {
        type: fetchIngredients.pending.type
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при fulfilled записывает ингредиенты и выключает isLoading', () => {
      const loadingState: TIngredientsState = {
        ...initialState,
        isLoading: true
      };
      const state = ingredientsReducer(loadingState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('при rejected записывает текст ошибки и выключает isLoading', () => {
      const loadingState: TIngredientsState = {
        ...initialState,
        isLoading: true
      };
      const errorMessage = 'Network error';
      const state = ingredientsReducer(loadingState, {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('при rejected без message записывает дефолтный текст ошибки', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: {}
      });
      expect(state.error).toBe('Не удалось загрузить ингредиенты');
    });
  });
});
