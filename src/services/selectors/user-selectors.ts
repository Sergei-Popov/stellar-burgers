import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) => !!state.user.user;
export const selectLoginError = (state: RootState) => state.user.loginError;
export const selectRegisterError = (state: RootState) =>
  state.user.registerError;
export const selectUpdateError = (state: RootState) => state.user.updateError;
