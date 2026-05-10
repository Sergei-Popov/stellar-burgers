import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loginError: string | null;
  registerError: string | null;
  updateError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loginError: null,
  registerError: null,
  updateError: null
};

export const checkUserAuth = createAsyncThunk<TUser | null>(
  'user/checkAuth',
  async () => {
    if (!getCookie('accessToken')) {
      return null;
    }
    try {
      const response = await getUserApi();
      return response.user;
    } catch {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearRegisterError: (state) => {
      state.registerError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error.message ?? 'Не удалось войти';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError =
          action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.registerError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateError =
          action.error.message ?? 'Не удалось обновить данные';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateError = null;
      });
  }
});

export const { clearLoginError, clearRegisterError, clearUpdateError } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
