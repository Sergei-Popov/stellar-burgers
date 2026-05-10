import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export type TNewOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const placeOrder = createAsyncThunk(
  'newOrder/place',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return { ...response.order, ingredients: ingredientIds };
  }
);

const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      });
  }
});

export const { closeOrderModal } = newOrderSlice.actions;
export const newOrderReducer = newOrderSlice.reducer;
