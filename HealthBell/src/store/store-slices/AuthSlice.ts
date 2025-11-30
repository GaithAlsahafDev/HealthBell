// src/store/store-slices/AuthSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  uid: string | null;
  email: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  uid: null,
  email: null,
  isAuthenticated: false,
};

type SetUserPayload = {
  uid: string;
  email: string | null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SetUserPayload>) {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (s: { auth: AuthState }) =>
  s.auth.isAuthenticated;

export const selectAuthUid = (s: { auth: AuthState }) => s.auth.uid;

export const selectAuthEmail = (s: { auth: AuthState }) => s.auth.email;
